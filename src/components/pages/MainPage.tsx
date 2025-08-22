import { useEffect } from 'react';
// Importujemy już nie Link, a Button, ponieważ będziemy otwierać modal
import { useAppSelector, useAppDispatch } from '../../store';
import { clearNewSubmissionFlag, FormData } from '../../store/formsSlice';
import { openModal, closeModal } from '../../store/modalSlice'; // Importuj akcje modala
import Modal from '../Modal'; // Importuj komponent Modal
import '../../styles/MainPage.css';
import UncontrolledForm from './UncontrolledForm'; // Importuj komponenty formularzy
import ReactHookFormPage from './ReactHookForm';

const MainPage = () => {
  const { submissions, newSubmissionId } = useAppSelector(
    (state) => state.forms
  );
  const dispatch = useAppDispatch();

  const { isOpen: isModalOpen, formType: modalFormType } = useAppSelector(
    (state) => state.modal
  ); // Pobierz stan modala
  useEffect(() => {
    // Clear the new submission flag after 3 seconds
    if (newSubmissionId) {
      const timer = setTimeout(() => {
        dispatch(clearNewSubmissionFlag());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [newSubmissionId, dispatch]);

  const handleOpenModal = (type: 'uncontrolled' | 'react-hook-form') => {
    dispatch(openModal(type));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const renderFormData = (submission: FormData) => {
    const isNew = submission.id === newSubmissionId;

    return (
      <div
        key={submission.id}
        className={`submission-card ${isNew ? 'new-submission' : ''}`}
      >
        <h3>Form Submission ({submission.formType})</h3>
        <p>
          <strong>Name:</strong> {submission.name}
        </p>
        <p>
          <strong>Age:</strong> {submission.age}
        </p>
        <p>
          <strong>Email:</strong> {submission.email}
        </p>
        <p>
          <strong>Gender:</strong> {submission.gender}
        </p>
        <p>
          <strong>Country:</strong> {submission.country}
        </p>
        <p>
          <strong>Terms Accepted:</strong>{' '}
          {submission.termsAccepted ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Submitted:</strong>{' '}
          {new Date(submission.timestamp).toLocaleString()}
        </p>
        {submission.image && (
          <div className="image-preview">
            <p>
              <strong>Uploaded Image:</strong>
            </p>
            <img src={submission.image} alt="User uploaded" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="main-page">
      <h1>React Forms Application</h1>

      <div className="navigation">
        <h2>Choose a Form Type:</h2>
        <div className="nav-links">
          {/* Zmień Linki na Buttony */}
          <button
            className="nav-link"
            onClick={() => handleOpenModal('uncontrolled')}
          >
            Uncontrolled Components Form
          </button>
          <button
            className="nav-link"
            onClick={() => handleOpenModal('react-hook-form')}
          >
            React Hook Form
        </div>
      </div>

      <div className="submissions-container">
        <h2>Form Submissions</h2>
        {submissions.length === 0 ? (
          <p className="no-submissions">
            No form submissions yet. Please fill out one of the forms.
          </p>
        ) : (
          <div className="submissions-grid">
            {submissions.map(renderFormData)}
          </div>
        )}
      </div>

      {/* Renderuj Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalFormType === 'uncontrolled' && (
          <UncontrolledForm onCloseModal={handleCloseModal} />
        )}
        {modalFormType === 'react-hook-form' && (
          <ReactHookFormPage onCloseModal={handleCloseModal} />
        )}
    </div>
  );
};

export default MainPage;
