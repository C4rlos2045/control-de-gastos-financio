function AvatarUploader({
  avatar,
  setAvatar
}) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png'
    ) {
      alert('Solo se permiten imágenes JPG o PNG');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-avatar-section">
      <label
        htmlFor="avatarUpload"
        className="profile-avatar"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar de usuario"
          />
        ) : (
          <span className="profile-avatar__placeholder">
            👤
          </span>
        )}

        <span className="profile-avatar__overlay">
          Cambiar foto
        </span>
      </label>

      <input
        id="avatarUpload"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageChange}
        hidden
      />

      <p className="profile-avatar__note">
        Formatos permitidos: JPG, PNG
      </p>
    </div>
  );
}

export default AvatarUploader;