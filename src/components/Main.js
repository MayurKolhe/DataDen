import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";

export default function Main(props) {
  const { allFiles, deleteFile } = props;
  const { filesList, downloadFile } = props;
  const { shareFile } = props;
  const [recipientAddress, setRecipientAddress] = useState("");
  const [popUpMap, setPopUpMap] = useState({});
  const { setExpDate, renameFile } = props;
  const [selectedDate, setSelectedDate] = useState("");
  const [renameFileName, setrenameFileName] = useState("");
  const [FileIndex, setFileIndex] = useState();
  const [renameIndex, setRenameIndex] = useState();
  const convertBytes = (bytes) => {
    var sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  };

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hours = a.getHours();
    var minutes = a.getMinutes();

    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;

    var time =
      date +
      " " +
      month +
      " " +
      year +
      " " +
      hours +
      ":" +
      minutes +
      " " +
      ampm;
    return time;
  }

  function deleteFile0(_id) {
    var _isDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (_isDelete) {
      deleteFile(_id);
      // toast("Wow so easy!");
    }
  }
  function downloadFileMain(_id, _fileHash) {
    var _isDelete = window.confirm("Please Complete the Transaction First");
    if (_isDelete) {
      downloadFile(_id, _fileHash);
    }
  }

  function shareFileMain(_id) {
    setPopUpMap((prevMap) => ({
      ...prevMap,
      [_id]: !prevMap[_id], // Toggle the popUp state for the specific file
    }));
    setRecipientAddress("");
  }

  function handleShareFile(
    _recipientAddress,
    _fileHash,
    _fileType,
    _fileName,
    _fileSize,
    _fileDes,
    _uploadTime,
    _id
  ) {
    shareFile(
      _recipientAddress,
      _fileHash,
      _fileType,
      _fileName,
      _fileSize,
      _fileDes,
      _uploadTime
    );
    setRecipientAddress("");
    setPopUpMap((prevMap) => ({
      ...prevMap,
      [_id]: false, // Set the popUp state to false for the specific file
    }));
  }

  function handleDateChange(e, index) {
    // const d = new Date().toISOString().slice(0, 16)
    // console.log("**********"+d);
    setSelectedDate(e.target.value);
    setFileIndex(index);
  }

  function handleRenameFileChange(e, index) {
    setrenameFileName(e.target.value);
    setRenameIndex(index);
  }
  function setRenameFile(_id, renameFileName) {
    var _isConfirm = window.confirm("Please Complete the Transaction First");
    if (_isConfirm) {
      renameFile(_id, renameFileName);
      // toast("Wow so easy!");
    }
  }

  function setExpirationDate(_id, _expDateTime) {
    var _isSet = window.confirm(
      "Your File will be deleted on " +
        _expDateTime.slice(0, 10) +
        " at " +
        _expDateTime.slice(11)
    );
    if (_isSet) {
      setExpDate(_id, _expDateTime);
      // toast("Wow so easy!");
    }
  }

  const renderPopUp = (file) => {
    // const popUp = popUpMap[file.fileId.toNumber()] || false;
    return (
      <div className="share-file">
        <textarea
          rows="4"
          cols="9"
          placeholder="Recipient address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
        <button
          onClick={() =>
            handleShareFile(
              recipientAddress,
              file.fileHash,
              file.fileType,
              file.fileName,
              file.fileSize,
              file.fileDes,
              file.uploadTime,
              file.fileId.toNumber()
            )
          }
          className="btn btn-primary btn-sm"
        >
          Ok
        </button>
        <button
          onClick={() => {
            setPopUpMap((prevMap) => ({
              ...prevMap,
              [file.fileId.toNumber()]: false, // Set the popUp state to false for the specific file
            }));
          }}
          className="btn btn-primary btn-sm mt-2"
        >
          Cancel
        </button>
      </div>
    );
  };

  return (
    <div className="container text-center  mt-5 mb-5 ">
      <div className="row">
        <div
          className="col bg-light bg-gradient"
          style={{ borderRadius: 40, width: "120%" }}
        >
          <section className="m-5">
            <h1 style={{ color: "#292b2c" }}>My DataDen</h1>
            <div className="tbl-header" style={{ borderRadius: 40 }}>
              <Table
                striped
                bordered
                hover
                variant="warning"
                cellPadding="0"
                cellSpacing="0"
                border="2px"
                style={{ width: "100%", borderRadius: 40 }}
              >
                <thead>
                  <tr className="bg-ligth">
                    <th style={{ color: "#292b2c", width: "20%" }}>Name</th>
                    <th style={{ color: "#292b2c", width: "26%" }}>
                      file Info
                    </th>
                    <th style={{ color: "#292b2c", width: "8%" }}>File Type</th>
                    <th style={{ color: "#292b2c", width: "8%" }}>Size</th>
                    <th style={{ color: "#292b2c", width: "13%" }}>Date</th>
                    <th style={{ color: "#292b2c", width: "24%" }}>
                      Select Expiration Date
                    </th>
                    <th style={{ color: "#292b2c", width: "19%" }}>
                      Download File
                    </th>
                    <th style={{ color: "#292b2c", width: "13%" }}>Share</th>
                    <th style={{ color: "#292b2c", width: "13%" }}>
                      Rename File
                    </th>
                    <th style={{ color: "#292b2c", width: "10%" }}>Delete</th>
                  </tr>
                </thead>
              </Table>
            </div>
            <div className="tbl-content">
              <Table striped bordered hover responsive variant="light">
                <tbody>
                  {(allFiles || filesList) &&
                    allFiles.map((file, index) => {
                      let infoType = "";
                      if (
                        file.fileType ===
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      )
                        infoType = "doc/docx";
                      else if (
                        file.fileType ===
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                      )
                        infoType = "ppt/pptx";
                      else if (
                        file.fileType ===
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      )
                        infoType = "xls/xlsx";
                      else if (file.fileType === "application/pdf")
                        infoType = "pdf";
                      else infoType = file.fileType;
                      return (
                        <tr key={index}>
                          <td style={{ color: "#292b2c", width: "20%" }}>
                            {file.fileName}
                          </td>
                          <td style={{ color: "#292b2c", width: "27%" }}>
                            {file.fileDes}
                          </td>
                          <td style={{ color: "#292b2c", width: "9%" }}>
                            {infoType}
                          </td>
                          <td style={{ color: "#292b2c", width: "8%" }}>
                            {convertBytes(file.fileSize)}
                          </td>
                          <td style={{ color: "#292b2c", width: "13%" }}>
                            {timeConverter(file.uploadTime)}
                          </td>
                          <td style={{ color: "#292b2c", width: "25%" }}>
                            <input
                              type="datetime-local"
                              value={index === FileIndex ? selectedDate : ""}
                              onChange={(e) => {
                                handleDateChange(e, index);
                              }}
                              min={new Date().toISOString().slice(0, 16)}
                              max="2023-07-15T00:00"
                              style={{ width: "100%" }}
                            ></input>
                            {index === FileIndex ? (
                              <button
                                onClick={() => {
                                  setExpirationDate(
                                    file.fileId.toNumber(),
                                    selectedDate
                                  );
                                }}
                                className="btn btn-primary mt-2"
                              >
                                Set
                              </button>
                            ) : (
                              ""
                            )}
                          </td>
                          <td style={{ color: "#292b2c", width: "20%" }}>
                            <button
                              onClick={() => {
                                downloadFileMain(
                                  file.fileId.toNumber(),
                                  file.fileHash
                                );
                              }}
                              className="btn btn-primary btn-sm"
                            >
                              Download
                            </button>
                          </td>
                          <td style={{ color: "#292b2c", width: "15%" }}>
                            <button
                              onClick={() => {
                                shareFileMain(file.fileId);
                              }}
                              className="btn btn-primary btn-sm mb-2"
                            >
                              Share
                            </button>
                            {popUpMap[file.fileId.toNumber()] &&
                              renderPopUp(file)}
                          </td>
                          <td style={{ color: "#292b2c", width: "13%" }}>
                            <input
                              type="text"
                              value={
                                index === renameIndex ? renameFileName : ""
                              }
                              onChange={(e) => {
                                handleRenameFileChange(e, index);
                              }}
                              style={{ width: "100%" }}
                            ></input>
                            {index === renameIndex ? (
                              <button
                                onClick={() => {
                                  setRenameFile(
                                    file.fileId.toNumber(),
                                    renameFileName
                                  );
                                }}
                                className="btn btn-primary mt-2"
                              >
                                Set
                              </button>
                            ) : (
                              ""
                            )}
                          </td>
                          <td style={{ color: "#292b2c", width: "10%" }}>
                            <button
                              onClick={() => {
                                deleteFile0(file.fileId.toNumber());
                              }}
                              className="btn btn-danger btn-sm"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </section>
        </div>
      </div>
      <Link to="uploadfiles">
        <button
          style={{ width: "30%" }}
          className="btn btn-outline-dark mt-4 mb-2"
        >
          Upload File
        </button>
      </Link>
    </div>
  );
}
