import React from 'react'
import {
  useHistory,
  Link
} from "react-router-dom";

export default function UploadFile(props) {
  let history = useHistory();

  const { captureFile, uploadFile, showFileDetails} = props;

  const uploadFile0 = () => {
    const _fileDes = document.getElementById('fileDesBox').value;
    const _fileName = document.getElementById('fileNameBox').value;
    uploadFile(_fileName, _fileDes)

    history.push("/");
  }

  return (
    <div className="container text-center  mt-3 mb-5">
      <Link to="/">
        <button style={{ width: '30%' }} className="btn btn-lg btn-outline-dark mt-4 mb-2">Check Uploaded Files</button>
      </Link>
      <div className="row">
        <div className="col bg-dark bg-gradient" style={{ borderRadius: 40 }}>
          <div className="m-5">
            <h1 className="">Upload Your File</h1>
            <div className="m-5" >
              <input className="form-control" onChange={captureFile} type="file" id="formFile" />
            </div>

            <div className={`mx-5 text-start text-light ${showFileDetails ? "" : "d-none"}`} id="fileDetailsBox">
              <h6 className="text-center text-warning">File Details:-</h6>
              <div className="col-12">
                <label for="fileNameBox" className="form-label">File Name</label>
                <input type="text" className="form-control" maxLength="60" id="fileNameBox" placeholder="type file name here " />
              </div>
              <div className="col-12 mt-2">
                <label for="fileDesBox" className="form-label">File Description</label>
                <input type="text" className="form-control" maxLength="200" id="fileDesBox" placeholder="type file Description here " />
              </div>
              <div className="row mx-2 mt-2">
                <div className="col-6">
                  <label for="fileTypeBox" className="form-label">File Type</label>
                  <input type="text" className="form-control" id="fileTypeBox" placeholder="file type" disabled />
                </div>
                <div className="col-6">
                  <label for="fileSizeBox" className="form-label">File Size</label>
                  <input type="text" className="form-control" id="fileSizeBox" placeholder="file size" disabled />
                </div>
              </div>

              <div className="mt-5 text-center">
                <button type="submit" onClick={uploadFile0} className="btn btn-warning">Upload File Now</button>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div >
  )
}







