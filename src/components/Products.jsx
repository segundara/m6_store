import React from "react";
import ContentLoader from "react-content-loader"
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Alert,
  Tab,
  Nav,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router";
import Pagination from "react-bootstrap-4-pagination";
import "./Style.css";

class Products extends React.Component {
  state = {
    products: [],
    numOfProduct: [],
    numPerPage: 8,
    currentPageNum: 1,
    loading: false,
    pageNumbers: [],
  };

  getNumberOfProduct = async () => {
    let total = [];
    const categories = await this.getCategories();
    if (categories) {
      for (const category of categories) {
        // get total number for each category
        const url = `${process.env.REACT_APP_API_URL}/products?category=${category}`;
        const resp = await fetch(url);

        if (resp.ok) {
          const products = await resp.json();
          total.push(products.count);
        }
      }

      // get total number for all category together
      const url = `${process.env.REACT_APP_API_URL}/products`;
      const resp = await fetch(url);

      if (resp.ok) {
        const products = await resp.json();
        total.unshift(products.count);
      }
      this.setState({
        numOfProduct: total,
      });
      this.getPages(total);
    }
  };

  getPages = (total) => {
    const pages = [];
    for (let i = 0; i < total.length; i++) {
      const element = total[i];
      let innerPages = [];
      for (let j = 1; j <= Math.ceil(element / this.state.numPerPage); j++) {
        innerPages.push(j);
      }
      pages.push(innerPages);
    }
    this.setState({
      pageNumbers: pages,
    });
  };

  changePage = (value) => {
    if (value > 1) {
      this.setState({
        currentPageNum: value,
      });
    } else {
      this.setState({ currentPageNum: 1 });
    }
    this.fetchProducts();
  };

  getCategories = async () => {
    const url = `${process.env.REACT_APP_API_URL}/products`;
    const resp = await fetch(url);

    if (resp.ok) {
      const categories = await resp.json();
      let catArray = categories.data.map((item) => item.category);
      let selectedCategories = [];
      catArray.map((item) =>
        !selectedCategories.includes(item)
          ? selectedCategories.push(item)
          : null
      );

      return selectedCategories;
    }
  };

  fetchProducts = async () => {
    this.setState({
      loading: true,
    });
    let allCategories = [];
    const categories = await this.getCategories();
    if (categories) {
      const skip =
        this.state.currentPageNum * this.state.numPerPage -
        this.state.numPerPage;
      for (const category of categories) {
        // get all products and break them into category and add into the array
        let list = {};
        const url = `${process.env.REACT_APP_API_URL}/products?category=${category}&limit=${this.state.numPerPage}&offset=${skip}`;
        const resp = await fetch(url);

        if (resp.ok) {
          const products = await resp.json();
          list.category = category;
          list.items = products.data;
          allCategories.push(list);
        }
      }

      // get all products for all categories and add into the array
      let listForAll = {};
      const category = "All Products";
      const url = `${process.env.REACT_APP_API_URL}/products?limit=${this.state.numPerPage}&offset=${skip}`;
      const resp = await fetch(url);

      if (resp.ok) {
        const products = await resp.json();
        listForAll.category = category;
        listForAll.items = products.data;
        allCategories.unshift(listForAll);
      }
      this.setState({
        products: allCategories,
        loading: false,
      });
    }
  };

  componentDidMount() {
    this.getNumberOfProduct();
    this.fetchProducts();
  }

  linkToDetails = (id) => {
    this.props.history.push("/productDetails/" + id);
  };

  addToCart = async (productId) => {
    const userid = 1;
    const url = `${process.env.REACT_APP_API_URL}/cart`;
    const addProduct = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ productid: productId, userid: userid }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (addProduct.ok) {
      this.props.sendCartUpdate(productId, userid);
    }
  };

  render() {
    return (
      <>
        <Container fluid>
          {this.state.loading && (
            <ContentLoader style={{ width: '100%', height: '100vh' }} viewBox="0 0 1500 800" height={800} width={1500} {...this.props}>
              <rect x="5" y="45" rx="4" ry="4" width="220" height="35" />
              <rect x="5" y="85" rx="4" ry="4" width="220" height="35" />
              <rect x="5" y="125" rx="4" ry="4" width="220" height="35" />
              <rect x="5" y="165" rx="4" ry="4" width="220" height="35" />
              <rect x="250" y="43" rx="0" ry="0" width="280" height="300" />
              <rect x="550" y="43" rx="0" ry="0" width="280" height="300" />
              <rect x="850" y="43" rx="0" ry="0" width="280" height="300" />
              <rect x="1150" y="43" rx="0" ry="0" width="280" height="300" />
              <rect x="250" y="400" rx="2" ry="2" width="280" height="300" />
              <rect x="550" y="400" rx="2" ry="2" width="280" height="300" />
              <rect x="850" y="400" rx="2" ry="2" width="280" height="300" />
              <rect x="1150" y="400" rx="2" ry="2" width="280" height="300" />
            </ContentLoader>
          )}
          {this.state.products && this.state.products.length > 0 && (
            <div className="inStore">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey="0"
                onSelect={() => this.changePage(1)}
              >
                <Row>
                  <Col md={2}>
                    <Nav variant="pills" className="flex-column">
                      {this.state.products.map((list, i) => {
                        return (
                          <Nav.Item key={i}>
                            <Nav.Link
                              eventKey={i}
                              className="d-flex justify-content-between"
                            >
                              <small>
                                <b>{list.category}</b>
                              </small>
                              <Badge variant="light">
                                <span>{this.state.numOfProduct[i]}</span>
                              </Badge>
                            </Nav.Link>
                          </Nav.Item>
                        );
                      })}
                    </Nav>
                  </Col>
                  <Col md={10}>
                    <Tab.Content>
                      {this.state.products.map((list, i) => {
                        return (
                          <Tab.Pane key={i} eventKey={i}>
                            {//!this.state.loading &&
                              list.items.length > 0 &&
                              this.state.pageNumbers &&
                              this.state.pageNumbers.length > 0 && (
                                <>
                                  <div className="d-flex flex-wrap">
                                    {list.items.map((product) => (
                                      <Card
                                        key={product._id}
                                        className="productCard"
                                      >
                                        <Card.Img
                                          variant="top"
                                          src={product.image_url}
                                          height="40%"
                                        />
                                        <Card.Body>
                                          <Card.Title>
                                            {product.name}
                                          </Card.Title>
                                          <label>
                                            Brand: {product.brand}
                                          </label>
                                          <h4> €{product.price}</h4>
                                          <div className="d-flex justify-content-between">
                                            <Button
                                              variant="info"
                                              onClick={() =>
                                                this.linkToDetails(
                                                  product._id
                                                )
                                              }
                                            >
                                              detail
                                                </Button>
                                            <Button
                                              variant="secondary"
                                              onClick={
                                                () =>
                                                  this.addToCart(
                                                    product._id
                                                  )
                                              }
                                            >
                                              add to cart
                                                  <FontAwesomeIcon
                                                icon={faCartPlus}
                                              />
                                            </Button>
                                          </div>
                                        </Card.Body>
                                      </Card>
                                    ))}
                                  </div>
                                  <div className="d-flex justify-content-between mt-2 mainPageFooter">
                                    <Pagination
                                      threeDots
                                      totalPages={
                                        this.state.pageNumbers[i].length
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

                                    <Alert
                                      variant="light"
                                    >
                                      page{" "}
                                      <strong>
                                        {this.state.currentPageNum}
                                      </strong>{" "}
                                        of{" "}
                                      <strong>
                                        {this.state.pageNumbers[i].length}
                                      </strong>
                                    </Alert>
                                  </div>
                                </>
                              )}
                            {!this.state.loading && list.items.length < 1 && (
                              <p className="text-center">
                                <strong>No product in store</strong>
                              </p>
                            )}
                          </Tab.Pane>
                        );
                      })}
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          )}

        </Container>
      </>
    );
  }
}

export default withRouter(Products);