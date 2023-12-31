'use client'

import { styles } from "@/app/styles/style";
import { useEffect, useState } from "react";
import Button from "../../Button";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

interface Props {
    courseInfo: any;
    setCourseInfo: (courseInfo: any) => void;
    active: number;
    setActive: (active: number) => void;
}

const CourseInformation = ({courseInfo, setCourseInfo, active, setActive}: Props) => {

     // DRAG AND DROP STATE
    const [dragging, setDragging] = useState(false);

    // CATEGORIES STATE
    const [categories, setCategories] = useState([]);

    // GET CATEGORIES FROM HERO DATA QUERY
    const { data } = useGetHeroDataQuery("Categories", {});

    useEffect(() => {
      if (data) {
        setCategories(data.layout.categories);
      }
    }, [data]);
  

    // UPLOAD COURSE THUMBNAIL
    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0]
        if(file) {
            const reader = new FileReader()

            reader.onload = (e: any) => {
                if(reader.readyState === 2) {
                    setCourseInfo({ ...courseInfo, thumbnail: reader.result})
                }
            }
            reader.readAsDataURL(file)
        }
    }

    // DRAG AND DROP FILES
    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(true);
      };
    
      const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(false);
      };
    
      const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);
    
        const file = e.dataTransfer.files?.[0];
    
        if (file) {
          const reader = new FileReader();
    
          reader.onload = () => {
            setCourseInfo({ ...courseInfo, thumbnail: reader.result });
          };
          reader.readAsDataURL(file);
        }
      };

     // GO TO NEXT STEP
    const handleSubmit = (e: any) => {
        e.preventDefault();
        setActive(active + 1);
    }

    return (
        <div className="w-[80%] m-auto mt-24 overflow-visible">
            <form onSubmit={handleSubmit} className={`${styles.label}`}>
               {/* COURSE NAME */}
              <div>
              <label htmlFor="">Course Name</label>
              <input type="name" name="" required value={courseInfo.name}
               onChange={(e: any) => setCourseInfo({ ...courseInfo, name: e.target.value })} id="name"
               placeholder="Give your course a name" className={`${styles.input}`}/>
              </div>
              <br />
                {/* COURSE DESCRIPTION */}
              <div className="mb-5">
              <label className={`${styles.label}`}>Course Description</label>
               <textarea name="" id="" cols={30} rows={8} placeholder="Write something amazing..."
               className={`${styles.input} !h-min !py-2`} value={courseInfo.description}
               onChange={(e: any) => setCourseInfo({ ...courseInfo, description: e.target.value })}/>
              </div>
              <br />
              <div className="w-full flex justify-between">
               {/* COURSE PRICE */}
              <div className="w-[45%]">
            <label className={`${styles.label}`}>Course Price</label>
             <input type="number" name="" required value={courseInfo.price}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, price: e.target.value })} id="price"
              placeholder="29" className={`${styles.input}`}/>
            </div>
               {/* COURSE ESTIMATED PRICE */}
             <div className="w-[50%]">
             <label className={`${styles.label} w-[50%]`}>
              Estimated Price (optional)
            </label>
            <input type="number" name="" value={courseInfo.estimatedPrice}
             onChange={(e: any) => setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })}
             id="price" placeholder="79" className={`${styles.input}`}/>
             </div>
            </div>
            <br />
            <div className="w-full flex justify-between">
                {/* COURSE TAGS */}
              <div className="w-[45%]">
              <label className={`${styles.label}`} htmlFor="email">
              Course Tags
            </label>
            <input type="text" required name="" value={courseInfo.tags}
             onChange={(e: any) => setCourseInfo({ ...courseInfo, tags: e.target.value })}
              id="tags" placeholder="Give your course some tags" className={`${styles.input}`}/>
              </div>
                {/* COURSE CATEGORIES */}
              <div className="w-[50%]">
              <label className={`${styles.label} w-[50%]`}>
              Course Categories
              </label>
            <select
              name=""
              id=""
              className={`${styles.input}`}
              value={courseInfo.category}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, categories: e.target.value })
              }
            >
              <option value="" className="dark:text-black">Select Category</option>
              {categories &&
                categories.map((item: any) => (
                  <option value={item.title} key={item._id} className="dark:text-black">
                    {item.title}
                  </option>
                ))}
            </select>
              </div>
            </div>
            <br />
              {/* COURSE LEVEL */}
            <div className="w-full flex justify-between">
              <div className="w-[45%]">
              <label className={`${styles.label}`}>Course Level</label>
            <input type="text" name="" value={courseInfo.level} required
             onChange={(e: any) => setCourseInfo({ ...courseInfo, level: e.target.value })} id="level"
             placeholder="Beginner/Intermediate/Expert" className={`${styles.input}`}/>
              </div>
              {/* COURSE DEMO VIDEO */}
              <div className="w-[50%]">
              <label className={`${styles.label} w-[50%]`}>Demo Url</label>
            <input type="text" name="" required value={courseInfo.demoUrl}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })}
              id="demoUrl" placeholder="eer74fd" className={`${styles.input}`}/>
              </div>
            </div>
            <br />
            {/* UPLOAD COURSE THUMBNAIL OR DRAG AND DROP */}
            <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border cursor-pointer flex items-center justify-center ${
              dragging ? "bg-[#00df9a]" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt=""
                className="max-h-full w-full object-cover"
              />
            ) : (
              <span className="text-black dark:text-white">
                Drag and drop your thumbnail here or click to browse
              </span>
            )}
          </label>
        </div>
        <br />
         <div className="w-full flex items-center justify-end">
           <Button className={`${styles.button}`} type="submit" value="Next">
              Next
           </Button>
         </div>
         <br />
         <br />
            </form>
        </div>
    )
}

export default CourseInformation
