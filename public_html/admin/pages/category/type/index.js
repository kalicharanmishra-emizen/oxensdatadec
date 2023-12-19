import Admin from 'layouts/Admin'
import UserHeader from 'components/Headers/UserHeader'
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown } from "reactstrap";
import Link from 'next/link';
function Index() {
    return (
        <>
            <UserHeader/>
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-1" xl='12'>
                    <Card className="bg-secondary shadow">
                        <CardHeader className="bg-white border-0">
                            <Row className="align-items-center">
                            <Col xs="8">
                                <h3 className="mb-0">Category Type List</h3>
                            </Col>
                            <Col xs="4">
                                <Link href="/category/type/create">
                                    <Button color="success">Create category type</Button>
                                </Link>
                            </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Title</th>
                                <th scope="col" />
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </Table>
                        </CardBody>
                        <CardFooter className="py-4">
                        </CardFooter>
                    </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
Index.layout = Admin
export default Index
