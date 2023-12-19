import React from 'react'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

export default function PaginationCom({data,pagFun}) {
    let paginationLink=[];
    if (!data.page) {
        paginationLink.push(
            <PaginationItem key="0" className="active">
                <PaginationLink
                    onClick={
                        (e) => {
                            e.preventDefault()
                        }
                    }
                >
                    1
                </PaginationLink>
            </PaginationItem>
        )
    } else {
        for (let index = 1; index <= data.totalPages; index++) {
            paginationLink.push(
                <PaginationItem key={index} className={`${(index==data.page)&&"active"}`}>
                    <PaginationLink
                        onClick={
                            (e) => {
                                e.preventDefault()
                                if (index!=data.page)
                                    pagFun(index)
                            }
                        }
                    >
                        {index}
                    </PaginationLink>
                </PaginationItem>
            )
        }
    }
    
    return (
        <>
            <Pagination
                className="pagination mb-0"
                listClassName="justify-content-end mb-0"
            >
                
                <PaginationItem className={`${(!data.hasPrevPage)&&"disabled"}`}>
                <PaginationLink
                    onClick={(e) => {
                            e.preventDefault();
                            if (data.hasPrevPage)
                                pagFun(data.prevPage)
                        }
                    }
                    tabIndex="-1"
                >
                    <i className="fas fa-angle-left" />
                    <span className="sr-only">Previous</span>
                </PaginationLink>
                </PaginationItem>
                {paginationLink}
                <PaginationItem className={`${(!data.hasNextPage)&&"disabled"}`}>
                    <PaginationLink
                        onClick={(e) => {
                            e.preventDefault()
                            if (data.hasNextPage)
                                pagFun(data.nextPage)
                        }
                    }
                    >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                    </PaginationLink>
                </PaginationItem>
            </Pagination>
        </>
    )
}


