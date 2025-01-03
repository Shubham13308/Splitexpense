import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../../Css/group.css";
import GroupModal from "./GroupModal";

const Group = () => {
  const [modalShow, setModalShow] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [formData, setFormData] = useState({
    groupName: "",
    persons: [],
  });
  const [errors, setErrors] = useState({});
  const [loadingmodal, setLoadingmodal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [membersdata, setMembersData] = useState("");
  const token = localStorage.getItem("token");

  const handleSelectChange = (e) => {
    const number = e.target.value;
    setSelectedNumber(number);
    const persons = Array.from({ length: number }, () => ({
      name: "",
      expense_type: "",
      amount: "",
    }));
    setFormData((prevData) => ({
      ...prevData,
      persons: persons,
    }));
  };

  const handleInputChange = (index, field, value) => {
    const updatedPersons = [...formData.persons];
    updatedPersons[index] = {
      ...updatedPersons[index],
      [field]: value,
    };
    setFormData((prevData) => ({
      ...prevData,
      persons: updatedPersons,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.groupName) {
      newErrors.groupName = "Group Name is required.";
    }

    formData.persons.forEach((person, index) => {
      if (!person.name) newErrors[`name-${index}`] = "Name is required.";
   
      
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const currentDate = new Date();
    const transformedPersons = formData.persons.map((person) => ({
      name: person.name,
      expense_type: person.expense_type,
      amount: person.amount,
      date:currentDate
    }));

    const payload = {
      groupName: formData.groupName,
      members: transformedPersons,
    };

    try {
      setLoadingmodal(true);
      const response = await axios.post(
        "http://localhost:4002/group/add-groupmember",
        payload
      );
      setSuccessMessage("Group data submitted successfully!");
      console.log("Form Data Submitted:", response.data);
      onHide();
      fetchGroupData();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoadingmodal(false);
    }
  };

  const fetchGroupData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:4002/group/group-name"
      );
      const data = response.data.groups;
      setGroupData(data);
    } catch (err) {
      setError("No group Found");
      console.error("Error fetching group data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupName) => {
    try {
      await axios.delete(
        `http://localhost:4002/group/delete-group/${groupName}`
      );
      setGroupData(groupData.filter((group) => group.groupName !== groupName));
    } catch (err) {
      console.error("Error deleting group:", err);
      setError("Failed to delete group. Please try again.");
    }
  };

  const handlegroupdetails = async (groupName) => {
    try {
      const response = await axios.get(`http://localhost:4002/memberdetailroute/members/${groupName}`);

      // console.log("Group Details:", response.data);

      if (response.status === 200) {
        if (response.data && response.data.data && response.data.data.length > 0) {
          // setMembersData(response.data.data);
          localStorage.setItem('token',response.data.token)
          navigate("/details");
        } else {
          console.log("No members found for the group.");
        }
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  const fetchMemberDataFromToken = async () => {
    const group_name = formData[0]?.group_name;
    
    
    try {
      const response = await axios.get(`http://localhost:4002/group/fetch/${group_name}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        
        setMembersData(response.data.data); 
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMemberDataFromToken();
    } else {
      console.error("No token found. Please log in.");
      // navigate("/group"); 
    }
  }, [token, membersdata]);

  const handleGroupClick = () => {
    setModalShow(true);
  };

  const onHide = () => {
    setModalShow(false);
    setFormData({
      groupName: "",
      persons: [],
    });
    setSelectedNumber(0);
    setErrors({});
    setSuccessMessage("");
  };

  useEffect(() => {
    fetchGroupData();
  }, []);

  return (
    <div className="group-container">
      {modalShow && (
        <GroupModal
          show={modalShow}
          onHide={onHide}
          formData={formData}
          setFormData={setFormData}
          selectedNumber={selectedNumber}
          errors={errors}
          loading={loadingmodal}
          successMessage={successMessage}
          handleSelectChange={handleSelectChange}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )}

      <div className="group-box">
        <h2 className="group-title">
          Group List
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              marginRight: "10px",
              color: "#007bff",
              float: "right",
              cursor: "pointer",
            }}
            onClick={handleGroupClick}
          />
        </h2>

        {loading ? (
          <p>Loading groups...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="group-list">
            {groupData.map((group, index) => (
              <div key={index} className="group-item">
                <span
                  className="group-name"
                  onClick={() => handlegroupdetails(group.groupName)}>
                  {group.groupName}
                </span>

                <span
                  className="delete-icon"
                  onClick={() => handleDelete(group.groupName)}>
                  &times;
                </span>
                <br />
                <span style={{ color: "#330505" }}>
                  There are{" "}
                  <span style={{ color: "#f40000" }}>{group.membersCount}</span>{" "}
                  members
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Group;
