import React, {useState, useCallback} from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import Style from './DropZone.module.css'
import images from '../../../img'
import { FaCloudUploadAlt } from 'react-icons/fa'

const DropZone = ({
  title, 
  heading, 
  subHeading, 
  name,
  price, 
  website, 
  description,
  royalties,
  fileSize, 
  properties, 
  category, 
  image, 
  uploadFileToIPFS,
  setImage,
}) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      if (!acceptedFiles || acceptedFiles.length === 0) {
        return;
      }
      
      const file = acceptedFiles[0];
      console.log("File selected:", file.name, "Size:", file.size);
      
      setIsUploading(true);
      const url = await uploadFileToIPFS(file);
      setFileUrl(url);
      setImage(url);
      setUploadError("");
      console.log("URL after upload:", url);
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      setUploadError(error.message || "Error uploading file");
    } finally {
      setIsUploading(false);
    }
  }, [setImage, uploadFileToIPFS]);
   
  const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.svg'],
      'video/*': ['.mp4']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false
  });
   
  return (
    <div className={Style.DropZone}>
      <div 
        className={`${Style.DropZone_box} ${isDragActive ? Style.active : ""} ${isDragReject ? Style.reject : ""}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className={Style.DropZone_box_input}>
          {!isUploading ? (
            <>
              <div className={Style.DropZone_box_input_img}>
                <FaCloudUploadAlt size={50} color="#4c5773" />
              </div>
              <p className="font-bold text-lg">{heading}</p>
              <p className="text-gray-500">{subHeading}</p>
              <p className="text-sm text-gray-400 mt-2">{title}</p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mb-4"></div>
              <p>Uploading to IPFS...</p>
            </div>
          )}
          
          {uploadError && (
            <p className="text-red-500 mt-4 font-medium">{uploadError}</p>
          )}
        </div>
      </div>
      
      {fileUrl && (
        <div className={Style.DropZone_box_aside}>
          <h3 className="text-xl font-bold mb-4">NFT Preview</h3>
          <div className={Style.DropZone_box_aside_box}>
            <img 
              src={fileUrl} 
              alt="NFT Preview"
              className="w-full rounded-lg shadow-md"
            />
            <div className="flex flex-col">
              <div className="mb-4">
                <p className="border-b border-gray-300 py-2">
                  <span className="font-semibold">Name: </span>
                  {name || "Unnamed NFT"}
                </p>
                <p className="border-b border-gray-300 py-2">
                  <span className="font-semibold">Price: </span>
                  {price || "0"} ETH
                </p>
                {website && (
                  <p className="border-b border-gray-300 py-2">
                    <span className="font-semibold">External link: </span>
                    {website}
                  </p>
                )}
              </div>
              
              {description && (
                <div className="mb-4">
                  <p className="border-b border-gray-300 py-2">
                    <span className="font-semibold">Description: </span>
                    {description}
                  </p>
                </div>
              )}
              
              {category && (
                <div>
                  <p className="border-b border-gray-300 py-2">
                    <span className="font-semibold">Collection: </span>
                    {category}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DropZone