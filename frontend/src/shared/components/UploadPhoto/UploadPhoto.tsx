import { AddPhotoBook } from '@/shared/ui/icons/AddPhotoBookSvg';
import { NoImgAddPhoto } from '@/shared/ui/icons/NoImgAddSvg';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';

const UploadPhoto = () => {
  const [previewUrls, setpPreviewUrls] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File[]>([]);

  const url = useRef(photo);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const photoArr = Array.from(e.target.files);
    setPhoto((prev) => [...prev, ...photoArr]);

    console.log(photoArr);
    console.log(photo);

    const urls = photoArr.map((photo) => URL.createObjectURL(photo));
    setpPreviewUrls((prev) => [...prev, ...urls]);
  };

  useEffect(() => {
    return () => {
      url.current?.forEach((photoUrl) => {
        URL.revokeObjectURL(photoUrl);
      });
    };
  }, []);

  return (
    <>
      <div>
        <h3 className=" text-h3m   p-[8px]">Upload photo</h3>
        {/*  */}

        {photo.length >= 0 && photo.length < 4 ? (
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
                  flex justify-center gap-[12px]  flex-wrap 
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
                      <img src={previewUrls[i]} alt={`photo-${i}`} />
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
              className="w-[104px] h-[144px] 
                  mt-[6px] mr-[16px] mb-[6px] ml-[8px]
                  flex items-center justify-center
                 "
            >
              {previewUrls[0] && <img src={previewUrls[0]} alt={'photo'} />}
            </div>
            <ul
              className="min-w-[191px] h-[156px] 
                  flex justify-center gap-[12px] items-center  flex-wrap 
                  px-[33.5px]
                 
                 "
            >
              {previewUrls.map((url, i) => (
                <li
                  key={i}
                  className="bg-[#F7F8F2] w-[56px] h-[72px] rounded-[10px]
                       flex items-center justify-center
                        "
                >
                  <img src={url} alt={`photo-${i}`} />
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
{
  /* <div
                className="flex flex-col 
              border-[0.4px] border-solid border-[#B6B6B6] rounded-xl 
              min-h-[201px] 
              "
              >
                <h3 className="font-kyiv text-h3m   p-[8px]">Upload photo</h3>
    
                <div className="flex">
                  <div
                    className="min-w-[104px] h-[144px]  bg-[#F7F8F2] 
                  mt-[6px] mr-[16px] mb-[6px] ml-[8px]
                  flex items-center justify-center
                  "
                  >
                    <label className="">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handlePhotosChange(e.target.files)}
                        className="hidden"
                      />
    
                      <AddPhotoBook />
                    </label>
                  </div>
    //  
                  <div
                    className="min-w-[191px] h-[156px] 
                  flex justify-center gap-[12px]  flex-wrap 
                  px-[33.5px]
                  "
                  >
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-[#F7F8F2] w-[56px] h-[72px] rounded-[10px]
                        flex items-center justify-center
                        "
                      >
                        <NoImgAddPhoto />
                      </div>
                    ))}
    
                    {formData.photos.length > 0 && (
                      <p>{formData.photos.length} photo(s) selected</p>
                    )}
                  </div>
                </div>
              </div> */
}
