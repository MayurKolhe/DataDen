import React, { Component } from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
import Web3 from "web3";
import DataDen from "./abis/DataDen.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./components/App.css";
import TopNavbar from "./components/TopNavbar";
import Main from "./components/Main";
import UploadFile from "./components/UploadFile";
import NotConnected from "./components/NotConnected";
import Background from "./components/Background";
const projectId = "2PIgRlo5DGu97UFh5LZZvKgylph";
const projectSecret = "2fd4a702ad5d630652bf3afe98dba7c9";
const ipfsClient = require("ipfs-http-client");
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);

      this.loadBlockchainData();
    } else {
      this.setState({ connected: false });
    }
  }
  async loadBlockchainData() {
    const web3 = new Web3(window.ethereum);

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    web3.eth.defaultAccount = account;
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const data = DataDen.networks[networkId];
    // const data = "0xDA7BB0E01AB52883DCcf80103D64E0f1C6322Db0"; 

    if (data) {
      const dataDen = web3.eth.Contract(
        DataDen.abi,
        data.address
        // data
      );
      this.setState({ dataDen });
      await this.loadMyAllFiles();
      this.setState({ loading: false });
    } else {
      this.setState({ connected: false });
    }
  }
  async loadMyAllFiles() {
    this.setState({
      allFiles: [],
    });
    const totalFilesCount = await this.state.dataDen.methods
      .getTotalFileCount()
      .call();

    for (let i = totalFilesCount; i >= 1; i--) {
      let file = await this.state.dataDen.methods.getFileOf(i).call();
      if (file.fileName !== "0deleted_") {
        this.setState({
          allFiles: [...this.state.allFiles, file],
        });
      }
    }
  }
  async deleteFile(_id) {
    this.setState({
      loading: true,
    });
    this.state.dataDen.methods
      .deleteFile(_id)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        console.log("transactionHash", hash);
      })
      .on("receipt", (receipt) => {})
      .on("confirmation", async (confirmationNumber, receipt) => {
        await this.loadMyAllFiles();
        this.setState({
          loading: false,
        });
      })
      .on("error", (error, receipt) => {
        console.log("error", error);
        console.log("receipt", receipt);
      });
  }
  
  /////////////////////Test functions//////////////////
  async setExpDate(_id, _expDateTime) {
    const targetDate = new Date(_expDateTime);
    // let d = new Date().toISOString().slice(0, 16)
    const delay = targetDate.getTime() - Date.now();
    // console.log("second"+Date.now().toLocaleString());

    this.setState({
      loading: true,
    });

    this.state.dataDen.methods
      .deleteFile(_id)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        console.log("transactionHash", hash);
      })
      .on("receipt", async (receipt) => {
        await this.loadMyAllFiles();
        this.setState({
          loading: false,
        });
      })
      .on("confirmation", async (confirmationNumber, receipt) => {
        console.log("confirmation", confirmationNumber);
        if (confirmationNumber === 1) {
          setTimeout(async () => {
            await this.loadMyAllFiles();
            this.setState({
              loading: false,
            });
          }, delay);
        }
      })
      .on("error", (error, receipt) => {
        console.log("error", error);
        console.log("receipt", receipt);
        this.setState({
          loading: false,
        });
      });
  }
  async renameFile(_id, _renameFileName){
    // console.log("from APP.js "+_renameFileName)
    this.setState({ 
      loading: true,
    });
    this.state.dataDen.methods
      .renameFile(_id, _renameFileName)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        console.log("transactionHash", hash);
      })
      .on("receipt", (receipt) => {})
      .on("confirmation", async (confirmationNumber, receipt) => {
        await this.loadMyAllFiles();
        this.setState({
          loading: false,
        });
      })
      .on("error", (error, receipt) => {
        console.log("error", error);
        console.log("receipt", receipt);
      });
  }

  async downloadFile(_id, _fileHash) {
    this.setState({ 
      loading: true,
    });
    this.state.dataDen.methods
      .downloadFile(_id, _fileHash)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        console.log("transactionHash", hash);
      })
      .on("receipt", (receipt) => {})
      .on("confirmation", async (confirmationNumber, receipt) => {
        await this.loadMyAllFiles();
        this.setState({
          loading: false,
        });
        window.open("https://dataden.infura-ipfs.io/ipfs/" + _fileHash, '_blank')
      })
      .on("error", (error, receipt) => {
        console.log("error", error);
        console.log("receipt", receipt);
      });
  }
  async captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        fileType: file.type,
      });
      this.setValues(file.name, this.convertBytes(file.size));
    };
  }
  async setValues(_name, _size) {
    const fileNameBox = document.getElementById("fileNameBox");
    const fileTypeBox = document.getElementById("fileTypeBox");
    const fileSizeBox = document.getElementById("fileSizeBox");

    fileNameBox.value = _name;
    fileTypeBox.value = this.state.fileType;
    fileSizeBox.value = _size;
    this.setState({ showFileDetails: true });
  }
  async uploadFile(_name, _des) {
    this.setState({ loading: true });
    // Add file to the IPFS
    ipfs
      .add(this.state.buffer)
      .then((result) => {
        this.state.dataDen.methods
          .uploadFile(
            result.path,
            result.size,
            this.state.fileType,
            _name,
            _des
          )
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            console.log("transactionHash", hash);
          })
          .on("receipt", (receipt) => {})
          .on("confirmation", async (confirmationNumber, receipt) => {
            await this.loadMyAllFiles();
            this.setState({
              loading: false,
              buffer: "",
              showFileDetails: false,
            });
          })
          .on("error", (error, receipt) => {
            console.log("error", error);
            console.log("receipt", receipt);
          });
      })
      .catch((error) => console.error(error));
  }
  async shareFile(
    _recipient,
    _fileHash,
    _fileType,
    _fileName,
    _fileSize,
    _fileDescription,
    _uploadTime
  ) {
    this.setState({ loading: true });
    await this.state.dataDen.methods
      .shareMyfile(
        _recipient,
        _fileHash,
        _fileType,
        _fileName,
        _fileSize,
        _fileDescription,
        _uploadTime
      )
      .send({ from: this.state.account, gas: 3000000 })
      .then(async (receipt) => {
        console.log(receipt);
        console.success("File Shared Sucessfully");
        await this.loadMyAllFiles();
      })
      .catch((err) => {
        console.error(err);
        console.error("Sorry your payment was not successful Please try again");
        this.setState({ loading: false });
      });
  }
  convertBytes(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      dataDen: null,
      postCount: 0,
      allFiles: [],
      buffer: "",
      fileType: "",
      showFileDetails: false,
      loading: true,
      connected: true,
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.shareFile = this.shareFile.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.setExpDate = this.setExpDate.bind(this);
    this.renameFile = this.renameFile.bind(this)
  }
  render() {
    return (
      // <Router>
      <>
        <Background />
        <HashRouter>
          <div className="">
            {this.state.connected ? (
              <>
                <TopNavbar
                  account={this.state.account}
                  userProfile={this.state.userProfile}
                />
                {this.state.loading ? (
                  <div className="text-center m-5">
                    <div
                      className="spinner-border bg-light m-auto"
                      role="status"
                    ></div>
                  </div>
                ) : (
                  <Switch>
                    <Route path="/" exact>
                      <Main
                        indexKey="key"
                        account={this.state.account}
                        allFiles={this.state.allFiles}
                        deleteFile={this.deleteFile}
                        downloadFile={this.downloadFile}
                        shareFile={this.shareFile}
                        setExpDate={this.setExpDate}
                        renameFile={this.renameFile}
                        showDeletedFiles={this.state.showDeletedFiles}
                      />
                    </Route>

                    <Route path="/uploadfiles" exact>
                      <UploadFile
                        account={this.state.account}
                        uploadFile={this.uploadFile}
                        captureFile={this.captureFile}
                        showFileDetails={this.state.showFileDetails}
                      />
                    </Route>
                  </Switch>
                )}
              </>
            ) : (
              <NotConnected />
            )}
          </div>

          {/* </Router> */}
        </HashRouter>
      </>
    );
  }
}
export default App;
