import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { clearNewSubmissionFlag, FormData } from '../../store/formsSlice';
import '../../styles/MainPage.css';
import Modal from '../Modal/Modal'; // New import
import UncontrolledForm from './UncontrolledForm'; // New import
import ReactHookFormPage from './ReactHookForm'; // New import

const MainPage = () => {
  const { submissions, newSubmissionId } = useAppSelector(
    (state) => state.forms
  );
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<
    'uncontrolled' | 'react-hook-form' | null
  >(null);

  const openModal = (formType: 'uncontrolled' | 'react-hook-form') => {
    setIsModalOpen(true);
    setModalContent(formType);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  useEffect(() => {
    // Clear the new submission flag after 3 seconds
    if (newSubmissionId) {
      const timer = setTimeout(() => {
        dispatch(clearNewSubmissionFlag());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [newSubmissionId, dispatch]);

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
          <button
            onClick={() => openModal('uncontrolled')}
            className="nav-link"
          >
            Uncontrolled Components Form
          </button>
          <button
            onClick={() => openModal('react-hook-form')}
            className="nav-link"
          >
            React Hook Form
          </button>
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

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent === 'uncontrolled' && (
          <UncontrolledForm onClose={closeModal} />
        )}
        {modalContent === 'react-hook-form' && (
          <ReactHookFormPage onClose={closeModal} />
        )}
      </Modal>
    </div>
  );
};

export default MainPage;
