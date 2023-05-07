// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OurStorageDapp {
    string public contractName = "Our Decentralized Storage (ODS)";

    address owner;

    modifier onlyowner() {
        require(msg.sender == owner, "You are not allowed");
        _;
    }

    mapping(address => uint256) internal totalFilesOf;

    mapping(address => mapping(uint256 => File)) internal fileOf;

    mapping(address => File[]) files_per_user;

    struct File {
        uint256 fileId;
        string fileHash;
        uint256 fileSize;
        string fileType;
        string fileName;
        string fileDes;
        uint256 uploadTime;
        address uploader;
    }

    event FileUploadedEvent(string action, address uploader);

    function getTotalFileCount() public view returns (uint256) {
        return totalFilesOf[msg.sender];
    }

    function getFileOf(uint256 _fileId) public view returns (File memory) {
        return fileOf[msg.sender][_fileId];
    }

    //start =>  upload- delete-edit
    function uploadFile(
        string memory _fileHash,
        uint256 _fileSize,
        string memory _fileType,
        string memory _fileName,
        string memory _fileDescription
    ) public {
        require(
            bytes(_fileHash).length > 0 &&
                bytes(_fileType).length > 0 &&
                bytes(_fileDescription).length > 0 &&
                bytes(_fileName).length > 0 &&
                msg.sender != address(0) &&
                _fileSize > 0
        );

        totalFilesOf[msg.sender]++;

        fileOf[msg.sender][totalFilesOf[msg.sender]] = File(
            totalFilesOf[msg.sender],
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            block.timestamp,
            msg.sender
        );

        emit FileUploadedEvent("File Uploaded", msg.sender);
    }

    function deleteFile(uint256 _id) public {
        fileOf[msg.sender][_id].fileName = "0deleted_";
    }

    function deleteFileForever(uint256 _id) public {
        fileOf[msg.sender][_id].fileHash = "";
        fileOf[msg.sender][_id].fileName = "0deleted_forever_";
        fileOf[msg.sender][_id].fileDes = "";
    }

    function downloadFile(uint256 _id, string memory _fileHash) public {
        fileOf[msg.sender][_id].fileHash = _fileHash;
    }

    function editFileDeatils(
        uint256 _id,
        string memory _name,
        string memory _des
    ) public {
        fileOf[msg.sender][_id].fileName = _name;
        fileOf[msg.sender][_id].fileDes = _des;
    }

    //end =>  upload- delete-edit
    
    function shareMyfile(
        address _recipient,
        string memory _fileHash,
        string memory _fileType,
        string memory _fileName,
        uint256 _fileSize,
        string memory _fileDescription,
        uint256 _uploadTime
    ) public {
        totalFilesOf[_recipient]++; // Increment the file count for the recipient

        File memory sharedFile;
        sharedFile.fileHash = _fileHash;
        sharedFile.fileType = _fileType;
        sharedFile.fileName = _fileName;
        sharedFile.fileSize = _fileSize;
        sharedFile.fileDes = _fileDescription;
        sharedFile.uploadTime = _uploadTime;
        sharedFile.uploader = msg.sender;

        files_per_user[_recipient].push(sharedFile); // Add the shared file to the recipient's files

        fileOf[_recipient][totalFilesOf[_recipient]] = sharedFile;

        emit FileUploadedEvent("File Shared", msg.sender);
    }
}
