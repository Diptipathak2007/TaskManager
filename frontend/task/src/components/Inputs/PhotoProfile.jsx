import React from 'react';

const PhotoProfile = ({ image, setImage }) => {
  const inputRef = React.useRef(null);
  const [preview, setPreview] = React.useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <input
        type="file"
        ref={inputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {!image ? (
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
            Profile
          </div>
          <button
            type="button"
            onClick={onChooseFile}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Remove Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoProfile;
