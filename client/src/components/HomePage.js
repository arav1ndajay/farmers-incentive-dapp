import React, { Component } from "react";
import NavBar from "./NavBar";
import {Carousel, Button} from "react-bootstrap"
import "../App.css";
import { Link } from "react-router-dom";


function TopCarousel()
{
  return (
        <Carousel>
        <Carousel.Item interval={1000}>
          <img
            width ={1400}
            height = {750}
            src={require('./img/pic2.jpg')}
            alt="First slide"
          />
          <Carousel.Caption>
            <h1 style = {{color:'black'}} >Register as Farmer?</h1>
            <Link to="/FarmerPage" className ="btn btn-primary">
              Farmer
            </Link>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={500}>
          <img
            width ={1400}
            height = {550}
            src={require('./img/farmer.jpg')}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            width ={1400}
            height = {550}
            src={require('./img/farmer.jpg')}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

  )
}

class HomePage extends Component {
  render() {
    return (
      <div>
        
        <NavBar />
        <TopCarousel/>
        
      </div>
    );
  }
}

export default HomePage;
