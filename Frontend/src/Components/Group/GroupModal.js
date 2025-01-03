import React from "react";
import "../../Css/group-modal.css";

const GroupModal = ({
  show,
  onHide,
  formData,
  selectedNumber,
  errors,
  loading,
  successMessage,
  handleSelectChange,
  handleInputChange,
  handleSubmit,
  setFormData,
}) => {
  const handleGroupNameChange = (e) => {
    setFormData({ ...formData, groupName: e.target.value });
  };

  return (
    <div
      className={`group-modal ${show ? "group-modal-show" : ""}`}
      tabIndex="-1"
      role="dialog">
      <div className="group-modal-dialog">
        <div className="group-modal-content">
          <div className="group-modal-header">
            <h5 className="group-modal-title">Group Details</h5>
            <button
              type="button"
              className="group-modal-close-btn"
              aria-label="Close"
              onClick={onHide}></button>
          </div>
          <div className="group-modal-body">
            <div className="group-details-container">
              <div className="form-group">
                <label htmlFor="groupName" className="form-label">
                  Group Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.groupName ? "input-invalid" : ""
                  }`}
                  id="groupName"
                  placeholder="Enter Group Name"
                  value={formData.groupName}
                  onChange={handleGroupNameChange}
                />
                {errors.groupName && (
                  <div className="input-error-message">{errors.groupName}</div>
                )}
              </div>

              <label htmlFor="personsDropdown" className="form-label">
                No of Persons
              </label>
              <select
                id="personsDropdown"
                className="form-select custom-select"
                value={selectedNumber}
                onChange={handleSelectChange}>
                <option value="0">Select Number</option>
                {[...Array(8).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>

              {selectedNumber > 0 && (
                <>
                  {Array.from({ length: selectedNumber }, (_, index) => (
                    <div key={index} className="person-details">
                      <div className="form-group">
                        <label
                          htmlFor={`personName-${index}`}
                          className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors[`name-${index}`] ? "input-invalid" : ""
                          }`}
                          id={`personName-${index}`}
                          value={formData.persons[index]?.name || ""}
                          onChange={(e) =>
                            handleInputChange(index, "name", e.target.value)
                          }
                        />
                        {errors[`name-${index}`] && (
                          <div className="input-error-message">
                            {errors[`name-${index}`]}
                          </div>
                        )}
                      </div>

               
                  
                    </div>
                  ))}
                </>
              )}

              {successMessage && (
                <div className="alert-success">{successMessage}</div>
              )}
            </div>
          </div>
          <div className="group-modal-footer">
            <button type="button" className="btn-secondary" onClick={onHide}>
              Close
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
