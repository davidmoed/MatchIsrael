import React from "react";
import "../styles/components/npModal.css";

const NPModal = ({ nonprofit, onClose, isOpen }) => {
  if (!isOpen) return null;

  const {
    nonprofit_name,
    description,
    contact_name,
    contact_role,
    phone,
    email,
    logo,
    additional_images,
    donation_link,
    homepage_english,
    preferred_contact_method,
    whatsapp_text,
    email_subject,
    email_text,
  } = nonprofit;

  const formattedPhone = phone.replace(/[+\-\s()]/g, "").replace(/^0/, "972");
  const formattedWhatsappText = encodeURIComponent(whatsapp_text);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2 className="modal-title">{nonprofit_name}</h2>
        </div>

        <div className="modal-body">
          <img src={logo} alt={nonprofit_name} className="modal-logo" />
          <div className="modal-description">
            <h3>About Us</h3>
            <p>{description}</p>
          </div>

          {additional_images?.length > 0 && (
            <div className="modal-gallery">
              {additional_images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${nonprofit_name} gallery ${index + 1}`}
                  className="gallery-image"
                />
              ))}
            </div>
          )}

          <div className="modal-contact">
            <h3>Contact Information</h3>
            <div className="modal-contact-top">
              {email && (
                <p>
                  <strong>Email: </strong>
                  <a
                    href={`mailto:${email}?subject=${email_subject}&body=${email_text}`}
                  >
                    {email}
                  </a>
                </p>
              )}
              {preferred_contact_method.toLowerCase() !== "email" && phone ? (
                <p>
                  <strong>WhatsApp: </strong>
                  <a
                    href={`https://wa.me/${formattedPhone}?text=${formattedWhatsappText}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {phone}
                  </a>
                </p>
              ) : (
                <></>
              )}
            </div>

            {contact_name && (
              <p>
                <strong>{contact_role || "Contact"}: </strong>
                {contact_name}
              </p>
            )}
          </div>

          <div className="modal-links">
            {homepage_english && (
              <a
                href={homepage_english}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-button website"
              >
                Visit Website
              </a>
            )}
            {donation_link && (
              <a
                href={donation_link}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-button donate"
              >
                Donate Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NPModal;
