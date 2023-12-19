// import { useEffect } from "react"
import { Button, Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { callApi } from "../../Helper/helper"

const SterlingReport = ({data,reportStatus,isOpen,handelReportModal,updateDriverList}) => {
    const handelStatusChange = (status)=>{
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to change driver verification status`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await callApi('post','/driver/backgroundcheckstatus',{
                      id:data.driverId,
                      status:status
                    })
                    Swal.fire({
                        icon: 'success',
                        title: 'Driver verification status successfull',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    // Close Modal
                    handelReportModal()
                    // update Current page list
                    updateDriverList()
                } catch (error) {
                    Swal.fire({
                        icon: 'danger',
                        title: error.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        })
    }
  return (
    <Modal isOpen={isOpen} className="modal-xl">
        <ModalHeader
            charCode="X"
            toggle={handelReportModal}
        />
        <ModalBody>
            { 
                Object.keys(data).length==0? 
                    <h1>No Data Found</h1>
                :
                    <>
                        <div className="row">
                            <div className="col-md-6">
                                Screening Id :- <b>{data.screeningId}</b>
                            </div>
                            <div className="col-md-6">
                                Package Id :- <b>{data.packageId}</b>
                            </div>
                            <div className="col-md-6">
                                Candidate Id :- <b>{data.candidateId}</b>
                            </div>
                            <div className="col-md-6">
                                Status :- <b>{data.status}</b>
                            </div>
                            <div className="col-md-6">
                                Result :- <b>{data.result}</b>
                            </div>
                            <div className="col-md-6">
                                Job Position :- <b>{data.jobPosition}</b>
                            </div>
                            <div className="col-md-12 my-2">
                                <h3>
                                    Sterling Report's
                                </h3>
                                <div className="row">
                                    {
                                        data.reportItems.map(itemObj=>(
                                            <div className="col-md-6 my-2">
                                                <Card>
                                                <CardBody>
                                                <ol>
                                                    {
                                                        Object.keys(itemObj).map(key=>(
                                                            <li>
                                                                {key} :- <b>{itemObj[key]}</b>
                                                            </li>
                                                        ))
                                                    }
                                                </ol>
                                                </CardBody>
                                                </Card>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                                    
                        </div>
                    </>
            }
        </ModalBody>
        {
            reportStatus==0 && Object.keys(data).length!=0?
                <ModalFooter className="px-0">
                    <div className="w-100 text-center">
                        <Button
                            color="success"
                            onClick={()=>handelStatusChange(1)}
                        >
                            Accpet
                        </Button>
                        <Button
                            color="danger"
                            onClick={()=>handelStatusChange(2)}
                        >
                            Reject
                        </Button>
                    </div>
                </ModalFooter>
            :
                null
        }
        
    </Modal>
  )
}
export default SterlingReport