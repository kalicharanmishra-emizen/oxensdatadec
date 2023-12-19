import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import "../../styles/store-detail.css";
import POSuser from "../Model/POSuser";
import { Input } from "reactstrap";
import { getPOSusers } from "../../reducers/mainSlice";

const posUserComponent = (props) => {
  const dispatch = useDispatch();

  const POSusers = useSelector((state) => state.mainSlice.POSuser);
  const storeDetail = useSelector((state) => state.storeSlice.storeDetail);

  const [inputBox, setInputBox] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [suggestionModel, setSuggestionModel] = useState(false);
  const [selectUser, setSelectUser] = useState(null);
  const [userFormModal, setUserFormModal] = useState(false);

  const userFormToggle = () => {
    setUserFormModal(!userFormModal);
  };

  const handelStatus = () => {
    setInputBox(false);
    setSuggestionModel(false);
  };

  const getTempUser = (data) => {
    setSelectUser(data);
    setInputBox(false);
    setSuggestionModel(false);
  };

  const clearAllStates = () => {
    setSelectUser(null);
    setInputBox(true);
    setSearchUser("");
  };

  const debounceLoad = useCallback(
    debounce((value) => {
      if (value != "" && value.length > 2) {
        dispatch(getPOSusers({ text: value }));
        setSuggestionModel(true);
        // autoComplete.getQueryPredictions({ input: value }, displaySuggestions);
      } else if (value == "") {
        setSuggestionModel(false);
        dispatch(getPOSusers({ text: value }));
      }
    }, 700),
    []
  );

  useEffect(() => {
    if (props.isReset) {
      clearAllStates();
      props.handelisReset(false);
    }
    props.handelPOSUser(selectUser);
  }, [selectUser, props.isReset]);

  console.log("is selectUser", selectUser);

  return (
    <section>
      <div>
        {inputBox ? (
          <>
            <Input
              type="text"
              className="search"
              value={searchUser}
              placeholder="Please Enter Mobile No"
              onChange={(e) => {
                setSearchUser(e.target.value);
                debounceLoad(e.target.value);
              }}
            />
            { searchUser 
              ? <div
                  className="bg-close"
                  onClick={() => {
                    setSearchUser("");
                    setSuggestionModel(false)
                  }}
                ></div> 
              : ""
            }
          </>
        ) : (
          <div className="selecetdInputBox">
            {selectUser?.value}
            <div style={{marginTop:"0px"}}
              className="bg-close"
              onClick={() => {
                setInputBox(true);
                setSearchUser("");
                setSelectUser(null);
              }}
            ></div>
          </div>
        )}
      </div>

      {suggestionModel ? (
        <div className="suggestions">
          <ul>
            {POSusers.length > 0 ? (
              POSusers.map((item) => (
                <li key={item._id}>
                  <div style={{textTransform:"capitalize"}}
                    onClick={() => {
                      handelStatus();
                      setSelectUser({
                        key: item._id,
                        value: `${item.name} (${item.phoneNo})`,
                        phoneno: item.phoneNo,
                      });
                    }}
                  >
                    {`${item.name} (${item.phoneNo})`}
                  </div>
                </li>
              ))
            ) : (
              <li className="createUserBtn_0">
                <div onClick={() => setUserFormModal(!userFormModal)}>
                  create user
                </div>
              </li>
            )}
          </ul>
        </div>
      ) : (
        ""
      )}

      <POSuser
        isOpen={userFormModal}
        toggle={userFormToggle}
        itemId={searchUser}
        storeId={storeDetail?.data?._id}
        getTempUser={getTempUser}
      />
    </section>
  );
};

export default posUserComponent;
