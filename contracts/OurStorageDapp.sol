// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OurStorageDapp {
    string public contractName = "Our Decentralized Storage (ODS)";

    mapping(address => uint256) internal totalFilesOf;
    mapping(address => mapping(uint256 => File)) internal fileOf;
    mapping(uint256 => mapping(address => bool)) internal sharedWith;

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
    event FileSharedEvent(uint256 fileId, address sharedWith);

    function getTotalFileCount() public view returns (uint256) {
        return totalFilesOf[msg.sender];
    }

    function getFileOf(uint256 _fileId) public view returns (File memory) {
        return fileOf[msg.sender][_fileId];
    }

    function shareFile(uint256 _fileId, address _sharedWith) public {
        require(fileOf[msg.sender][_fileId].fileId != 0, "File does not exist");
        sharedWith[_fileId][_sharedWith] = true;
        emit FileSharedEvent(_fileId, _sharedWith);
    }

    function getSharedFilesCount() public view returns (uint256) {
        uint256 count;
        for (uint256 i = 1; i <= totalFilesOf[msg.sender]; i++) {
            if (sharedWith[i][msg.sender]) {
                count++;
            }
        }
        return count;
    }

    function getSharedFileAt(uint256 _index) public view returns (File memory) {
        uint256 count;
        for (uint256 i = 1; i <= totalFilesOf[msg.sender]; i++) {
            if (sharedWith[i][msg.sender]) {
                count++;
                if (count == _index) {
                    return fileOf[msg.sender][i];
                }
            }
        }
        revert("Index out of range");
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

    function editFileDeatils(
        uint256 _id,
        string memory _name,
        string memory _des
    ) public {
        fileOf[msg.sender][_id].fileName = _name;
fileOf[msg.sender][_id].fileDes = _des;
}
}