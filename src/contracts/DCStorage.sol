// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract DCStorage {
    string public name = "DCStorage";
    uint public fileCount = 0;
    mapping(uint => File) public files;
    struct File {
        uint fileId;
        string fileHash;
        uint fileSize;
        string typeOfFile;
        string nameOfFile;
        string fileDescription;
        uint timeOfUpload;
        address payable uploader;
    }

    event FileUploaded(
        uint fileId,
        string fileHash,
        uint fileSize,
        string typeOfFile,
        string nameOfFile,
        string fileDescription,
        uint timeOfUpload,
        address payable uploader
    );

    function uploadFile(
        string memory _fileHash,
        uint _fileSize,
        string memory _fileType,
        string memory _fileName,
        string memory _fileDescription
    ) public {
        require(bytes(_fileHash).length > 0);
        require(bytes(_fileType).length > 0);
        require(bytes(_fileName).length > 0);
        require(bytes(_fileDescription).length > 0);
        require(msg.sender != address(0));
        require(_fileSize > 0);
        files[fileCount] = File(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            block.timestamp,
            payable(msg.sender)
        );
        fileCount++;
        emit FileUploaded(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            block.timestamp,
            payable(msg.sender)
        );
    }
}
