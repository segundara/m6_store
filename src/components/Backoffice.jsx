import React, { Component } from "react";
import {
    Container,
    Table,
    ToggleButton,
    ToggleButtonGroup,
    DropdownButton,
    Dropdown,
    ButtonGroup,
    Button,
    Modal,
    Form,
    Alert,
    Row,
    Col
} from "react-bootstrap";
import Pagination from "react-bootstrap-4-pagination";


class Backoffice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumbers: [],
            products: [],
            totalProducts: null,
            numPerPage: 5,
            currentPageNum: 1,
            sortingKeys: [],
            selectedKey: '...',
            orderKey: 'desc',
            orderKeysArray: ['asc', 'desc'],
            newProduct: {
                name: "",
                brand: "",
                description: "",
                category: '',
                price: ''
            },
            editProductInfo: {
                name: "",
                brand: "",
                description: "",
                category: '',
                price: ''
            },
            addModal: false,
            editModal: false,
            photo: '',
            productid: '',
        };

    }

    getNumberOfProduct = async () => {
        const totalProducts = `${process.env.REACT_APP_API_URL}/products`
        await fetch(totalProducts)
            .then((response) => response.json())

            .then((responseObject) => {
                this.setState({ totalProducts: responseObject.count })


                if (responseObject.data.length > 0) {
                    let keys = Object.keys(responseObject.data[0]);
                    const keyArr = []
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        if ((key === 'name') || (key === 'brand') || (key === 'description') || (key === 'category') || (key === 'price'))
                            keyArr.push(key)
                    }
                    this.setState({ sortingKeys: keyArr })
                }
                this.getPages(responseObject.count)
            })

    }

    getPages = (total) => {
        const pages = [];
        for (let i = 1; i <= Math.ceil(total / this.state.numPerPage); i++) {
            pages.push(i);
        }
        this.setState({
            pageNumbers: pages,
        });
    };

    changePage = (value) => {
        this.setState({
            currentPageNum: value
        })
        this.dataInPages(value)
    }

    dataInPages = async (currentPage) => {
        let sortParam
        if (this.state.selectedKey === '...') {
            const skip = (currentPage * this.state.numPerPage) - this.state.numPerPage
            const url = `${process.env.REACT_APP_API_URL}/products?limit=${this.state.numPerPage}&offset=${skip}`

            await fetch(url)
                .then((response) => response.json())

                .then((responseObject) =>
                    this.setState({
                        products: responseObject.data
                    })
                )
        }
        else {
            sortParam = this.state.selectedKey

            const skip = (currentPage * this.state.numPerPage) - this.state.numPerPage
            const url = `${process.env.REACT_APP_API_URL}/products?limit=${this.state.numPerPage}&offset=${skip}&sort=${sortParam}&order=${this.state.orderKey}`

            await fetch(url)
                .then((response) => response.json())

                .then((responseObject) =>
                    this.setState({
                        products: responseObject.data
                    })
                )
        }
    }

    getOrderBy = (eventKey) => {
        this.setState({ orderKey: eventKey })
    }

    sortedList = async (sortByKey) => {
        const skip = (this.state.currentPageNum * this.state.numPerPage) - this.state.numPerPage
        const url = `${process.env.REACT_APP_API_URL}/products?limit=${this.state.numPerPage}&offset=${skip}&sort=${sortByKey}&order=${this.state.orderKey}`

        await fetch(url)
            .then((response) => response.json())
            .then((responseObject) =>
                this.setState({ products: responseObject.data })
            )
    }

    orderedList = async (orderByKey) => {
        const skip = (this.state.currentPageNum * this.state.numPerPage) - this.state.numPerPage
        const url = `${process.env.REACT_APP_API_URL}/products?limit=${this.state.numPerPage}&offset=${skip}&sort=${this.state.selectedKey}&order=${orderByKey}`

        await fetch(url)
            .then((response) => response.json())
            .then((responseObject) =>
                this.setState({ products: responseObject.data })
            )
    }

    handleSelect = (eventKey) => {
        this.setState({ selectedKey: eventKey })
    }

    componentDidMount = async () => {

        this.getNumberOfProduct()

        this.dataInPages(this.state.currentPageNum)
    };


    saveImg = (e) => {
        this.setState({
            photo: e.target.files[0]
        });
    }

    updateProductInfo = async (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("product", this.state.photo)

        const resp = await fetch(`${process.env.REACT_APP_API_URL}/products/` + this.state.productid, {
            method: "PUT",
            body: JSON.stringify(this.state.editProductInfo),
            headers: {
                "Content-Type": "application/json"
            }
        })

        let addPhoto = await fetch(`${process.env.REACT_APP_API_URL}/products/` + this.state.productid + "/upload", {
            method: "POST",
            body: data
        })

        if (resp.ok) {
            this.setState({
                editModal: false
            });
            this.dataInPages()
        }

    }

    editInfo = async (productid) => {
        const resp = await fetch(`${process.env.REACT_APP_API_URL}/products/` + productid)

        if (resp.ok) {
            const product = await resp.json()
            console.log(product)
            this.setState({
                editProductInfo: {
                    name: product.data.name,
                    brand: product.data.brand,
                    description: product.data.description,
                    category: product.data.category,
                    price: product.data.price
                },
                productid: product.data._id,
                editModal: true
            });
        }
    }

    editSingleProductInfo = event => {
        let editProductInfo = this.state.editProductInfo
        let currentId = event.currentTarget.id
        console.log(currentId)
        editProductInfo[currentId] = event.currentTarget.value

        this.setState({ editProductInfo: editProductInfo })
    }


    getProductInfo = event => {
        let newProduct = this.state.newProduct
        let currentId = event.currentTarget.id
        console.log(currentId)
        newProduct[currentId] = event.currentTarget.value

        this.setState({ newProduct: newProduct })
    }


    addNewproduct = async (e) => {

        e.preventDefault();

        const url = `${process.env.REACT_APP_API_URL}/products`

        try {
            let response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(this.state.newProduct),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(response.json())
            if (response.ok) {
                alert('Record saved!')
                this.setState({
                    newProduct: {
                        name: "",
                        brand: "",
                        description: "",
                        category: '',
                        price: ''
                    },
                    addModal: false
                })
                this.dataInPages()
            } else {
                let json = await response.json()
                alert(json)
            }
        } catch (e) {
            console.log(e)
        }

    }

    deleteInfo = async (productid) => {
        const resp = await fetch(`${process.env.REACT_APP_API_URL}/products/` + productid, {
            method: "DELETE"
        })

        if (resp.ok) {
            alert('Product deleted!')
            this.dataInPages()
        }
    }

    render() {

        return (
            <Container className="pt-3">
                {this.state.pageNumbers.length > 0 && (

                    <>
                        <Button variant="info" onClick={() => this.setState({ addModal: true })}>Add new product</Button>
                        <DropdownButton
                            as={ButtonGroup}
                            className="mx-3"
                            key="left"
                            id={`dropdown-button-drop-left`}
                            drop="left"
                            variant="secondary"
                            title={`Sort by ${this.state.selectedKey.toUpperCase()}`}
                            onSelect={this.handleSelect}
                        >
                            {this.state.sortingKeys.map((key, i) => {
                                return (
                                    <Dropdown.Item key={i} eventKey={key} onClick={() => this.sortedList(key)}>{key}</Dropdown.Item>
                                )
                            })}
                        </DropdownButton>

                        <div className="d-flex mt-3">
                            <Alert variant="info" className="text-center">page <strong>{this.state.currentPageNum}</strong> of <strong>{this.state.pageNumbers.length}</strong></Alert>
                            {this.state.selectedKey !== '...'
                                ? (
                                    <div className="d-flex">
                                        <Alert variant="info" className="mx-3 text-center">Order By <strong>{this.state.selectedKey.toUpperCase()}</strong></Alert>
                                        <DropdownButton
                                            as={ButtonGroup}
                                            className="h-75"
                                            key="right"
                                            id={`dropdown-button-drop-right`}
                                            drop="right"
                                            variant="secondary"
                                            title={`${this.state.orderKey.toUpperCase()}ENDING order`}
                                            onSelect={this.getOrderBy}
                                        >
                                            {this.state.orderKeysArray.map((key, i) => {
                                                return (
                                                    <Dropdown.Item key={i} eventKey={key} onClick={() => this.orderedList(key)}>{key}</Dropdown.Item>
                                                )
                                            })}
                                        </DropdownButton>
                                    </div>
                                )
                                : null}
                        </div>

                        <Table striped bordered hover size="sm" responsive="sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {this.state.sortingKeys.map((header, i) => <th key={i}>{header.toUpperCase()}</th>)}
                                </tr>
                            </thead>
                            <tbody>

                                {this.state.products.map((product, i) => {

                                    return (
                                        <tr key={product._id}>
                                            <td>{this.state.currentPageNum > 1
                                                ? i = i + 1 + (this.state.numPerPage * this.state.currentPageNum) - this.state.numPerPage
                                                : i = i + 1}
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>{product.brand}</td>
                                            <td>{product.price}</td>
                                            <td>{product.category}</td>
                                            <td><Button variant="warning" onClick={() => this.editInfo(product._id)}>edit</Button></td>
                                            <td><Button variant="danger" onClick={() => this.deleteInfo(product._id)}>delete</Button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>

                        <Pagination
                            threeDots
                            totalPages={
                                this.state.pageNumbers.length
                            }
                            currentPage={this.state.currentPageNum}
                            showMax={2}
                            prevNext
                            activeBgColor="#17a2b8"
                            color="#17a2b8"
                            activeBorderColor="#17a2b8"
                            onClick={(page) =>
                                this.changePage(page)
                            }
                        />

                        <Modal
                            show={this.state.editModal}
                            onHide={() => this.setState({
                                editModal: false, editProductInfo: {
                                    name: "",
                                    brand: "",
                                    description: "",
                                    category: '',
                                    price: ''
                                }
                            })}>
                            <Modal.Body>
                                <Form onSubmit={this.updateProductInfo}>
                                    <div className="form-group mt-5">
                                        <label for="name">Product name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            placeholder="Input here the Product name"
                                            onChange={this.editSingleProductInfo}
                                            value={this.state.editProductInfo.name}
                                            required
                                        />
                                    </div>
                                    <div className="form-group ">
                                        <label for="brand">Product brand</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="brand"
                                            placeholder="Input here the Product brand"
                                            onChange={this.editSingleProductInfo}
                                            value={this.state.editProductInfo.brand}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label for="description">Product description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="description"
                                            placeholder="Input here the Product description"
                                            onChange={this.editSingleProductInfo}
                                            value={this.state.editProductInfo.description}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label for="category">Product category</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="category"
                                            placeholder="Input here the Product category"
                                            onChange={this.editSingleProductInfo}
                                            value={this.state.editProductInfo.category}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label for="price">Product price</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="price"
                                            placeholder="Input here the Product price"
                                            onChange={this.editSingleProductInfo}
                                            value={this.state.editProductInfo.price}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input type="file" name="file" onChange={this.saveImg} />
                                    </div>
                                    <div className="form-group">
                                        <Button className="btn btn-primary mt-4" type="submit">
                                            Update Product Info
                        </Button>
                                    </div>
                                </Form>

                            </Modal.Body>
                        </Modal>
                        <Modal
                            show={this.state.addModal}
                            onHide={() => this.setState({
                                addModal: false, newProduct: {
                                    name: "",
                                    surname: "",
                                    email: "",
                                    dateofbirth: '',
                                    country: ''
                                }
                            })}>
                            <Modal.Body>
                                <Form onSubmit={this.addNewproduct}>
                                    <div className="form-group mt-5">
                                        <label for="name">Product name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            placeholder="Input here the Product name"
                                            onChange={this.getProductInfo}
                                            value={this.state.newProduct.name}
                                            required
                                        />
                                    </div>
                                    <div className="form-group ">
                                        <label for="surname">Product brand</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="brand"
                                            placeholder="Input here the Product brand"
                                            onChange={this.getProductInfo}
                                            value={this.state.newProduct.brand}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label for="eamil">Product description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="description"
                                            placeholder="Input here the Product description"
                                            onChange={this.getProductInfo}
                                            value={this.state.newProduct.description}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label for="dateofbirth">Product category</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="category"
                                            placeholder="Input here the Product category"
                                            onChange={this.getProductInfo}
                                            value={this.state.newProduct.category}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label for="country">Product price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="price"
                                            placeholder="Input here the Product price"
                                            onChange={this.getProductInfo}
                                            value={this.state.newProduct.price}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <Button className="btn btn-primary mt-4" type="submit">
                                            Save Product Info
                        </Button>
                                    </div>
                                </Form>

                            </Modal.Body>
                        </Modal>
                    </>
                )}

            </Container>
        );
    }
}

export default Backoffice;