import { AddPhotoBook } from '@/shared/ui/icons/AddPhotoBookSvg';
import { NoImgAddPhoto } from '@/shared/ui/icons/NoImgAddSvg';
import { useState, type ChangeEvent } from 'react';
import { DeletePhotoSvg } from '@/shared/ui/icons/DeletePhotoSvg';
const UploadPhoto = () => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const limitPhoto = 4 - photo.length;
    if (limitPhoto <= 0) return;
    const photoArr = Array.from(e.target.files).slice(0, limitPhoto);
    setPhoto((prev) => [...prev, ...photoArr]);

    const urls = photoArr.map((photo) => URL.createObjectURL(photo));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const handleDelete = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setPhoto((prev) => prev.filter((__, i) => i !== index));
  };

  return (
    <>
      <div>
        <h3 className=" text-h3m   p-[10px]">Upload photo</h3>

        {photo.length < 4 ? (
          <div className="flex  ">
            <div>
              <label
                className="w-[104px] h-[144px]  bg-[#F7F8F2] 
                  mt-[6px] mr-[16px] mb-[6px] ml-[8px]
                  flex items-center justify-center
                 "
              >
                <input
                  id="fileItem"
                  onChange={handleChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                />

                <AddPhotoBook />
              </label>
            </div>

            <div>
              <ul
                className="min-w-[191px] h-[156px] 
                grid grid-cols-2 gap-[12px]          
                px-[33.5px]"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <li
                    key={i}
                    className="bg-[#F7F8F2] w-[56px] h-[72px] rounded-[10px]
                       flex items-center justify-center
                        "
                  >
                    {previewUrls[i] ? (
                      <div className="relative">
                        <img src={previewUrls[i]} alt={`photo-${i}`} />

                        <button
                          className="absolute inset-0 flex items-center justify-center"
                          onClick={() => {
                            handleDelete(i);
                          }}
                          type="button"
                        >
                          <DeletePhotoSvg />
                        </button>
                      </div>
                    ) : (
                      <NoImgAddPhoto />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex  ">
            <div
              className="w-[104px] h-[144px]  bg-[#F7F8F2] 
                  flex items-center justify-center
                   mt-[6px] mr-[16px] mb-[6px] ml-[8px]
                 "
            >
              {previewUrls[0] && (
                <img
                  src={previewUrls[0]}
                  alt={'photo'}
                  className="
                  flex"
                />
              )}
            </div>
            <ul
              className="min-w-[191px] h-[156px] 
                  grid grid-cols-2 gap-[12px]
                  px-[33.5px]
                  
                 
                 "
            >
              {previewUrls.map((_, i) => (
                <li
                  key={i}
                  className="bg-[#F7F8F2] w-[56px] h-[72px] rounded-[10px]
                       flex items-center justify-center
                       
                        "
                >
                  {previewUrls[i] ? (
                    <div className="relative">
                      <img src={previewUrls[i]} alt={`photo-${i}`} />

                      <button
                        className="absolute inset-0 flex items-center justify-center"
                        onClick={() => {
                          handleDelete(i);
                        }}
                        type="button"
                      >
                        <DeletePhotoSvg />
                      </button>
                    </div>
                  ) : (
                    <NoImgAddPhoto />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadPhoto;
