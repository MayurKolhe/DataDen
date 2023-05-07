import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

export default function Main(props) {
  const { allFiles, deleteFile } = props;
  const { filesList, downloadFile } = props;
  const { shareFile } = props;
  const [recipientAddress, setRecipientAddress] = useState("");
  const [popUpMap, setPopUpMap] = useState({});

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

  function handleShareFile(_recipientAddress,_fileHash,_fileType,_fileName,_fileSize,_fileDes,_uploadTime,_id) {
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

  const renderPopUp = (file) => {
    // const popUp = popUpMap[file.fileId.toNumber()] || false;
    return (
      <div className="share-file">
        <input
          type="text"
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
        >
          Cancel
        </button>
      </div>
    );
  };
  
  return (
    <div className="container text-center  mt-5 mb-5 ">
      <div className="row">
        <div className="col bg-light bg-gradient" style={{ borderRadius: 40 }}>
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
                    <th style={{ color: "#292b2c", width: "32%" }}>
                      file Info
                    </th>
                    <th style={{ color: "#292b2c", width: "8%" }}>File Type</th>
                    <th style={{ color: "#292b2c", width: "8%" }}>Size</th>
                    <th style={{ color: "#292b2c", width: "12%" }}>Date</th>
                    <th style={{ color: "#292b2c", width: "12%" }}>
                      Download File
                    </th>
                    <th style={{ color: "#292b2c", width: "8%" }}>Share</th>
                    <th style={{ color: "#292b2c", width: "8%" }}>Delete</th>
                  </tr>
                </thead>
              </Table>
            </div>
            <div className="tbl-content">
              <Table striped bordered hover responsive variant="light">
                <tbody>
                  {(allFiles || filesList) &&
                    allFiles.map((file, key) => {
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
                        <tr key={key}>
                          <td style={{ color: "#292b2c", width: "20%" }}>
                            {file.fileName}
                          </td>
                          <td style={{ color: "#292b2c", width: "32%" }}>
                            {file.fileDes}
                          </td>
                          <td style={{ color: "#292b2c", width: "8%" }}>
                            {infoType}
                          </td>
                          <td style={{ color: "#292b2c", width: "8%" }}>
                            {convertBytes(file.fileSize)}
                          </td>
                          <td style={{ color: "#292b2c", width: "12%" }}>
                            {timeConverter(file.uploadTime)}
                          </td>
                          <td style={{ color: "#292b2c", width: "12%" }}>
                            <button
                              onClick={() => {
                                downloadFileMain(
                                  file.fileId.toNumber(),
                                  file.fileHash
                                );
                              }}
                              className="btn btn-primary"
                            >
                              Download
                            </button>
                          </td>
                          <td style={{ color: "#292b2c", width: "12%" }}>
                            <button
                              onClick={() => {
                                shareFileMain(file.fileId);
                              }}
                              className="btn btn-primary"
                            >
                              Share
                            </button>
                            {popUpMap[file.fileId.toNumber()] &&
                              renderPopUp(file)}
                          </td>
                          <td style={{ color: "#292b2c", width: "8%" }}>
                            <button
                              onClick={() => {
                                deleteFile0(file.fileId.toNumber());
                              }}
                              className="btn btn-danger"
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
