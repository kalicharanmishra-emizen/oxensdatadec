import {Form, FormGroup, Label, Input} from 'reactstrap'
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import styles from "../../styles/sidebar.module.css";
import { useSelector,useDispatch } from 'react-redux';
import { getFilterList } from '../../reducers/storeSlice';
import { useRouter } from 'next/router';
export default function Sidebar({getFilterValue}) { 
  const dispatch = useDispatch()
  const router = useRouter()
  const filterList = useSelector(state => state.storeSlice.filterList)
  const [typeCategory, setTypeCategory] = useState([])
  const [isActive, setActive] = useState("false");
  const [isSort, setSort] = useState("false");
  const [filterData, setFilterData] = useState({
    typeOf:null,
    category:[]
  })
  const handleToggle = () => {
    setActive(!isActive);
    setSort(!isActive);  
  };
  const filterBtn=()=>{
    document.body.classList.add('filter-open')
  }
  const closefilter=()=>{
    document.body.classList.remove('filter-open')
  }
  const handelTypes = (e) => {
      let catList = filterList.type.find(type=>{
        return type._id == e.target.value 
      })
      setTypeCategory(catList.category)
      filterData.typeOf = e.target.value
      filterData.category = []
      setFilterData({...filterData})
  }
  const handelCat = (e) => {
    let cusArray = filterData.category
    if(e.target.checked){
      cusArray.push(e.target.value)
    }else{
       let index =  cusArray.indexOf(e.target.value)
       cusArray.splice(index, 1); 
    }
    filterData.category=cusArray
    setFilterData({...filterData})
  }
  useEffect(() => {
    if (filterList.type.length ==0) {
      dispatch(getFilterList())
    }
  }, [])
  useEffect(() => {
    if (filterList.type.length !=0) {
      let catList = filterList.type.find(type=>{
        return type._id == process.env.DEFAULT_CHECK_TYPE
      })
      filterData.typeOf = catList?._id
      setFilterData({...filterData})
      setTypeCategory(catList?.category)
    }
  }, [filterList])
  useEffect(() => {
    if(filterData.typeOf)
      getFilterValue(filterData)
  }, [filterData,router.query])
  return (   
    <>
    <div className={`${styles.sidebar}`}>
      <span onClick={filterBtn} className={`${styles.filterBtn}`}>Filter</span>
      <div className="sideNav">
        <span onClick={closefilter} className="closefilter"></span>
        <div className={`${styles.radioBlock}`}>
          <Form>
            <FormGroup className={`${styles.FormGroup}`}>
              {
                filterList.type.map(typeList=>(
                  <Label check key={typeList._id}>
                    <Input type="radio" value={typeList._id} name="typeOf" className={`${styles.checkInput}`} onChange={handelTypes} defaultChecked={process.env.DEFAULT_CHECK_TYPE == typeList._id?true:false} />
                    <span className={`${styles.checkmark}`}></span>
                    <span className={`${styles.radiotext}`}>{typeList.title}</span>
                  </Label>
                ))
              }
            </FormGroup>
          </Form>
        </div>
        <div className={`${styles.radioBlock}`}>
          <Form>
            <FormGroup className={`${styles.btnradio}`}>
              <Label check >              
                  <Input type="radio" name="radio1" className={`${styles.checkInput}`} defaultChecked />
                  <span className={`${styles.radioBtn}`}>
                    <span className={`${styles.radiotext}`}>Delivery</span>
                  </span>
              </Label>
              <Label check>
                  <Input type="radio" name="radio1" className={`${styles.checkInput}`} />
                  <span className={`${styles.radioBtn}`}>
                    <span className={`${styles.radiotext}`}>Pickup</span>
                  </span>
              </Label>
            </FormGroup>
          </Form>
        </div>
        <ul>
          {typeCategory?.length!=0?
            <li>
              <span role="button"><a onClick={handleToggle}>Categories<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" className="svg-inline--fa fa-angle-down fa-w-8 fa-2x"><path fill="currentColor" d="M119.5 326.9L3.5 209.1c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0L128 287.3l100.4-102.2c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L136.5 327c-4.7 4.6-12.3 4.6-17-.1z" className=""></path></svg></a></span>
              <Form>  
                <div className={isActive ? "show" : null} >  
                {typeCategory?.map(list=>(
                  <FormGroup key={list._id}>
                    <Label>
                      <Input type="checkbox" onChange={handelCat} name="category[]" value={list._id} className={`${styles.checkInput}`} />
                      <span className={`${styles.checkmark}`}></span>
                      <span className={`${styles.checktext}`}>{list.title}</span>
                    </Label>
                  </FormGroup> 
                ))} 
                </div>           
              </Form>
            </li>
          :''}
          
          <li>
            <span role="button"><a>Sort<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" className="svg-inline--fa fa-angle-down fa-w-8 fa-2x"><path fill="currentColor" d="M119.5 326.9L3.5 209.1c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0L128 287.3l100.4-102.2c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L136.5 327c-4.7 4.6-12.3 4.6-17-.1z" className=""></path></svg></a></span>
            
            <Form>  
              <div className={isSort ? "show" : null}>                      
                <FormGroup>
                  <Label check>
                  <Input type="checkbox" className={`${styles.checkInput}`} />
                    <span className={`${styles.checkmark}`}></span>
                    <span className={`${styles.checktext}`}> Top Rated</span>
                  </Label>
                </FormGroup> 
                <FormGroup>
                  <Label check>
                  <Input type="checkbox" className={`${styles.checkInput}`} />
                    <span className={`${styles.checkmark}`}></span>
                    <span className={`${styles.checktext}`}>Offers</span>
                  </Label>
                </FormGroup>  
              </div>           
            </Form>
          </li>
        </ul>
      </div>
    </div>
    </>
  )

}