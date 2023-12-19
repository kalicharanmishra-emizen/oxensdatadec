import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';

export default function PaginationClient(props) {
    const [itemsPerPage, setitemsPerPage] = useState(0)
    const [items,setItem] = useState([])
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    useEffect(()=>{
        setitemsPerPage(props.itemsPerPage)
        setItem(props.items)
    },[props.itemsPerPage,props.items])
    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;
        // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        props.getCurrentItem({items:items.slice(itemOffset, endOffset),currentOffset:itemOffset});
        setPageCount(Math.ceil(items.length / itemsPerPage));
    }, [itemOffset, itemsPerPage,items]);
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage % items.length;
        // console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setItemOffset(newOffset);
    };
    return (
        <>
                    <ReactPaginate
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={itemsPerPage}
                        pageCount={pageCount}
                        previousLabel="<"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
        </>
    )
}
