import { FormSection } from "../sections/form-section";

interface PhotoViewProps {
  photoId: string;
}

const PhotoView = ({ photoId }: PhotoViewProps) => {
  return (
    <div className="py-2.5 px-4">
      <FormSection photoId={photoId} />
    </div>
  );
};

export default PhotoView;
