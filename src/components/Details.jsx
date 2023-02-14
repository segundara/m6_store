import React, { Component, useContext } from 'react';
import {
    Container,
    Row,
    Col,
    Image,
    Button,
    Modal,
    Form,
    Accordion,
    Card,
    Badge
} from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import AccordionContext from "react-bootstrap/AccordionContext";
import ReactStars from "react-rating-stars-component";


function CustomToggle({ children, eventKey, callback }) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey)
    );

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
        <div
            onClick={decoratedOnClick}
            style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: "900",
                padding: "0.5rem 1rem",
                fontFamily: "sans-serif",
            }}
        >
            {children}
            <FontAwesomeIcon
                style={{ height: "2rem" }}
                icon={isCurrentEventKey ? faAngleUp : faAngleDown}
            />
        </div>
    );
}
class Details extends Component {

    state = {
        product: [],
        productid: null,
        addReview: false,
        editModal: false,
        newReviewComment: {
            comment: ""
        },
        newReviewRate: {
            rate: 1
        },
        reviews: [],
        photo: ''
    }

    handleComment = (e) => {
        this.setState({
            newReviewComment: { comment: e.currentTarget.value }
        });
    }

    handleRating = (newRating) => {
        this.setState({
            newReviewRate: { rate: parseInt(newRating) }
        });
    };

    fetchDetails = async () => {
        const resp = await fetch(`${process.env.REACT_APP_API_URL}/products/` + this.props.match.params.id)
        if (resp.ok) {
            const details = await resp.json()
            this.setState({
                product: details.data
            });
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products/` + this.props.match.params.id + "/reviews")
        if (response.ok) {
            const details = await response.json()
            this.setState({
                reviews: details.data
            });
        }
    }

    addReview = async (e) => {
        e.preventDefault()
        console.log(this.state.newReview)

        const reviewBody = ({ ...this.state.newReviewComment, ...this.state.newReviewRate, "productid": this.props.match.params.id })

        const resp = await fetch(`${process.env.REACT_APP_API_URL}/reviews`, {
            method: "POST",
            body: JSON.stringify(reviewBody),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (resp.ok) {

            this.setState({
                addReview: false,
                newReviewComment: {
                    comment: ""
                },
                newReviewRate: {
                    rate: 1
                },
            });

            this.fetchDetails()
        }
    }

    componentDidMount() {
        this.fetchDetails()
    }

    render() {
        console.log(this.state.reviews)
        console.log(this.state.product)
        return (
            <Container className="py-5">
                <Row>
                    {this.state.product && (
                        <>
                            <Col md={3} className="mt-5">
                                <Image src={this.state.product.image_url} style={{ height: "20rem", width: "20rem" }} />
                            </Col>
                            <Col md={7} className="mt-5 detail">
                                <div className="w-50">
                                    <p><h3>{this.state.product.name}</h3></p>
                                    <p>
                                        <span><strong>Description:</strong></span>
                                        <span> {this.state.product.description}</span>
                                    </p>
                                    <p>
                                        <span><strong>Brand:</strong></span>
                                        <span> {this.state.product.brand}</span>
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between w-50">
                                    <Badge variant="info" style={{ lineHeight: '2rem', fontSize: 'large' }}>€{this.state.product.price}</Badge>
                                    <Button variant="secondary" onClick={() => this.setState({ addReview: true })}>Add review</Button>
                                </div>

                                <div className="d-flex justify-content-center mt-4 w-75">
                                    {this.state.reviews.length > 0 ?
                                        <Accordion style={{ width: "70%" }}>
                                            <Card className="accordion-card">
                                                <CustomToggle as={Card.Header} eventKey="1">
                                                    See customers' reviews!
                                                        </CustomToggle>
                                                <Accordion.Collapse eventKey="1">
                                                    <>
                                                        {this.state.reviews.map(review =>
                                                            <Card.Body key={review._id}>
                                                                <div className="border-bottom">
                                                                    <ReactStars
                                                                        value={review.rate}
                                                                        size={24}
                                                                        edit={false}
                                                                    />
                                                                    {review.comment}
                                                                </div>

                                                            </Card.Body>
                                                        )}
                                                    </>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                        :
                                        null
                                    }
                                </div>
                            </Col>
                        </>
                    )}
                </Row>
                <Modal show={this.state.addReview} onHide={() => this.setState({
                    addReview: false,
                    productid: null,
                    newReviewComment: {
                        comment: ""
                    },
                    newReviewRate: {
                        rate: 1
                    }
                })}>
                    <Modal.Body>
                        <Form onSubmit={this.addReview} >
                            <Row className="d-flex justify-content-center">
                                <Col md={8}>
                                    <Form.Group controlId="comment">
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control
                                            value={this.state.newReviewComment.comment}
                                            onChange={this.handleComment}
                                            type="text"
                                            placeholder="Your comment for the product" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center">
                                <Col md={8}>
                                    <Form.Label>Rate the product</Form.Label>
                                    <ReactStars
                                        count={5}
                                        value={this.state.newReviewRate.rate}
                                        onChange={this.handleRating}
                                        size={24}
                                        activeColor="#ffd700"
                                    />
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" type="submit">
                                    Add review
                                </Button>

                            </div>

                        </Form>
                    </Modal.Body>
                </Modal>

            </Container>
        );
    }
}

export default Details;