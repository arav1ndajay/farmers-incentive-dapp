import React from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

const TopCarousel = () => {
  return (
    <div>
      <Carousel>
        <Carousel.Item interval={1000}>
          <img
            width="100%"
            height="100%"
            src={require("./img/pic1.jpg")}
            alt="First slide"
          />
          <Carousel.Caption>
            <h1>Register as Farmer?</h1>
            <Link to="/FarmerPage" className="btn btn-primary">
              Farmer
            </Link>
            <div style={{ paddingBottom: 220 }}></div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={500}>
          <img
            width="100%"
            height="100%"
            src={require("./img/farmer.jpg")}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            width="100%"
            height="100%"
            src={require("./img/farmer.jpg")}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default TopCarousel;
