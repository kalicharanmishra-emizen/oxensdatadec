import axios from "axios";
export const callApi = async (type, url, value = null, headers = {}) => {
  try {
    let api_headers = Object.assign(
      {},
      headers,
      { "x-access-token": localStorage.getItem("auth-vendor-token") },
      { Accept: "application/json" }
    );
    switch (type) {
      case "post":
        return await axios.post(process.env.API_BASE_URL + url, value, {
          headers: api_headers,
        });
        break;
      default:
        break;
    }
  } catch (e) {
    if (e.response) {
      throw e.response.data;
    } else {
      throw e.message;
    }
  }
};
export const getPaymentStatusColor = (data) => {
  let text = "";
  switch (data) {
    case 0:
      text = "dark";
      break;
    case 1:
      text = "primary";
      break;
    case 2:
      text = "warning";
      break;
    case 3:
      text = "warning";
      break;
    case 4:
      text = "warning";
      break;
    case 5:
      text = "info";
      break;
    case 6:
      text = "success";
      break;
    default:
      text = "danger";
      break;
  }
  return text;
};
export const getPaymentStatusText = (data) => {
  let text = "";
  switch (data) {
    case 0:
      text = "Pending";
      break;
    case 1:
      text = "Accept";
      break;
    case 2:
      text = "Ready to pickup";
      break;
    case 3:
      text = "Picked";
      break;
    case 4:
      text = "On the Way";
      break;
    case 5:
      text = "Arrived";
      break;
    case 6:
      text = "Delivered";
      break;
    default:
      text = "Reject";
      break;
  }
  return text;
};

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

export const paymentStatusColor = (data) => {
  let text = "";
  switch (data) {
    case 0:
      text = "primary";
      break;
    case 1:
      text = "success";
      break;
    case 2:
      text = "warning";
      break;
    default:
      text = "";
      break;
  }
  return text;
};
export const paymentStatusText = (data) => {
  let text = "";
  switch (data) {
    case 0:
      text = "processing";
      break;
    case 1:
      text = "success";
      break;
    case 2:
      text = "payment failed";
      break;
    default:
      text = "";
      break;
  }
  return text;
};

export const paymentModeColor = (data) => {
  let text = "";
  switch (data) {
    case 0:
      text = "primary";
      break;
    case 1:
      text = "success";
      break;
    case 2:
      text = "warning";
      break;
    default:
      text = "";
      break;
  }
  return text;
};
export const paymentModeText = (data) => {
  let text = "";
  switch (data) {
    case 0:
      text = "COD";
      break;
    case 1:
      text = "Wallet";
      break;
    case 2:
      text = "Others";
      break;
    default:
      text = "";
      break;
  }
  return text;
};

export const orderTypeColor = (data) => {
  let text = "";
  switch (data) {
    case 0:
      text = "primary";
      break;
    case 1:
      text = "success";
      break;
    default:
      text = "primary";
      break;
  }
  return text;
};
export const orderTypeText = (data) => {
  let text = "";
  switch (data) {
    case 0:
      text = "Online";
      break;
    case 1:
      text = "POS";
      break;
    default:
      text = "Online";
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

export const helpReason = (data) => {
  let text = "";
  switch (data) {
    case 1:
      text = "reason 1";
      break;
    case 2:
      text = "reason 2";
      break;
    case 3:
      text = "reason 3";
      break;
    case 4:
      text = "reason 4";
      break;
    case 5:
      text = "reason 5";
      break;
    default:
      text = "";
      break;
  }
  return text;
};