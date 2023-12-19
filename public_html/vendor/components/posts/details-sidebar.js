import React, { useEffect, useState } from "react";
import "../../styles/detailsSidebar.css";

export default function DetailsSidebar(props) {
  const [selectedCat, setSelectedCat] = useState(null);

  const filterBtn = () => {
    document.body.classList.add("filter-open");
  };

  const closefilter = () => {
    document.body.classList.remove("filter-open");
  };

  const handelClick = (e) => {
    setSelectedCat(e.currentTarget.getAttribute("value"));
  };

  useEffect(() => {
    if (props.filter.length != 0) {
      setSelectedCat(props.filter[0]._id);
    }
  }, [props.filter]);

  useEffect(() => {
    if (selectedCat) {
      props.getSelectedCat(selectedCat);
    }
  }, [selectedCat]);

  return (
    <>
      <div className={`sidebar`}>
        <span onClick={filterBtn} className={`filterBtn`}>
          Filter
        </span>
        <div className="sideNav">
          <span onClick={closefilter} className="closefilter"></span>
          <select
            className="selectBox"
            value={selectedCat}
            onChange={(e) => {
              setSelectedCat(e.target.value);
            }}
          >
            {props.filter.map((data) => (
              <option
                key={data._id}
                className="selectOptions"
                onClick={handelClick}
                value={data._id}
              >
                {data.title} {data.total}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
