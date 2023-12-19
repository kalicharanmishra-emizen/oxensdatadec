import axios from "axios";
export const callApi=async (type,url,value=null,headers={})=>{
    try {
       let api_headers = Object.assign({},headers,{'x-access-token':localStorage.getItem('auth-token')},{'Accept':'application/json'});
        switch (type) {
            case 'post':
                return await axios.post(process.env.API_BASE_URL+url,value,{headers:api_headers})
                break;
            default:
                break;
        }
     } catch (e) {
        if (e.response) {
           throw  e.response.data
        } else {
            throw e.message
        }
     }
    
    
}
export const getVehicleType = (data) => {
    let text = ''
    switch (data) {
        case 1:
            text='Cycle'
            break;
        case 2:
            text='Bike'
            break;
        case 3:
            text='Car'
            break;
    }
    return text
}
export const getPaymentStatusColor = (data) =>{
    let text = ''
    switch (data) {
        case 1:
            text = 'primary'
            break;
        case 2:
            text = 'warning'
            break;
        case 3:
            text = 'warning'
            break;
        case 4:
            text = 'warning'
            break;
        case 5:
            text = 'info'
            break;
        case 6:
            text = 'success'
            break;
        case 7:
            text = 'danger'
            break;
        default:
            text = 'dark'
            break;
    }
    return text
}
export const getPaymentStatusText = (data) =>{
    let text = ''
    switch (data) {
        case 1:
            text = 'Accept'
            break;
        case 2:
            text = 'Ready to pickup'
            break;
        case 3:
            text = 'Picked'
            break;
        case 4:
            text = 'On the Way'
            break;
        case 5:
            text = 'Arrived'
            break;
        case 6:
            text = 'Delivered'
            break;
        case 7:
            text = 'Refund'
            break;
        default:
            text = 'Pending'
            break;
    }
    return text
}

export const getPaymentStatusColors = (data) =>{
    let text = ''
    switch (data) {
        case 0:
            text = 'primary' 
            break;
        case 1:
            text = 'success'
            break;
        case 2:
            text = 'danger'
            break;
        default:
            text = ''
            break;
    }
    return text
}
export const getPaymentStatusTexts = (data) =>{
    let text = ''
    switch (data) {
        case 0:
            text = 'Processing'
            break;
        case 1:
            text = 'Success'
            break;
        case 2:
            text = 'Failed'
            break;
        default:
            text = ''
            break;
    }
    return text
}
export const getDiverJobColor = (data) => {
    let text = ''
    switch (data) {
        case 1:
            text = 'primary'
            break;
        case 2:
            text = 'danger'
            break;
        case 3:
            text = 'info'
            break;
        case 4:
            text = 'success'
            break;
        default:
            text = 'dark'
            break;
    }
    return text
}

export const getDiverJobTitle = (data) => {
    let text = ''
    switch (data) {
        case 1:
            text = 'Accept'
            break;
        case 2:
            text = 'Reject'
            break;
        case 3:
            text = 'On Proccess'
            break;
        case 4:
            text = 'Complete'
            break;
        default:
            text = 'Pending'
            break;
    }
    return text
}


export const getMonth = (data) => {
    let text = ""
      switch (data) {
        case 1:
          text = "Jan" 
          break;
        case 2:
          text = "Feb"
          break;
        case 3:
          text = "Mar" 
          break;
        case 4:
          text = "Apr"
          break;
        case 5:
          text = "May" 
          break;
        case 6:
          text = "Jun"
          break;
        case 7:
          text = "Jul" 
          break;
        case 8:
          text = "Aug"
          break;
        case 9:
          text = "Sep" 
          break;
        case 10:
          text = "Oct"
          break;
        case 11:
          text = "Nov" 
          break;
        case 12:
          text = "Dec"
          break;
        default:
          text = ""
          break;
      }
      return text
  }


  export const badgesColor = (data) => {
    let text = "";
    switch (data) {
      case 1:
        text = "#04bd7f";
        break;
      case 2:
        text = "#0d8dcc";
        break;
      case 3:
        text = "#22bd0c";
        break;
      case 4:
        text = "#f01a24";
        break;
      case 5:
        text = "#353535";
        break;
      default:
        text = "";
        break;
    }
    return text;
  };
  export const badgesText = (data) => {
    let text = "";
    switch (data) {
      case 1:
        text = "New Arrival";
        break;
      case 2:
        text = "Bestseller";
        break;
      case 3:
        text = "Featured";
        break;
      case 4:
        text = "Popular";
        break;
      case 5:
        text = "Trending";
        break;
      default:
        text = "";
        break;
    }
    return text;
  };
  export const paymentMode = (data) => {
    let text = "";
    switch (data) {
      case 0:
        text = "Cash";
        break;
      case 1:
        text = "Wallet";
        break;
      case 2:
        text = "Card";
        break;
      default:
        text = "";
        break;
    }
    return text;
  };
  