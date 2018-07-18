import React, { Component } from "react";
import { render } from "react-dom";
import update from "immutability-helper";
import LoadingSpinner from "./spinner";

import {
  ListGroup,
  ListGroupItem,
  Row,
  Grid,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import FormErrors from "./FormErrors";

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      location: "",
      data: [],
      formErrors: { firstName: "", lastName: "", location: "" },
      lastNameValid: false,
      firstNameValid: false,
      locationValid: false,
      formValid: false,
      loading: false
    };
    this.btn;

    // this.handleSubmit =this.handleSubmit.bind(this);
  }
  change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(
      {
        [name]: value
      },
      () => {
        this.validateField(name, value);
      }
    );
  };
  onSubmit = e => {
    e.preventDefault();
    this.btn.setAttribute("disabled", "disabled");
    this.setState({ loading: true }, () => {
      this.Searchresult(this.state);
    });
  };
  // handleSubmit(event){

  // }
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let firstNameValid = this.state.firstNameValid;
    let lastNameValid = this.state.lastNameValid;
    let locationValid = this.state.locationValid;

    switch (fieldName) {
      case "firstName":
        firstNameValid = value.match(/^[A-Za-z]+$/) && value.length > 2;
        fieldValidationErrors.firstName = firstNameValid ? "" : " is invalid";
        break;
      case "lastName":
        lastNameValid = value.match(/^[A-Za-z]+$/) && value.length > 2;
        fieldValidationErrors.lastName = lastNameValid ? "" : " is invalid";
        break;
      case "location":
        locationValid = value.length >= 2;
        fieldValidationErrors.location = locationValid ? "" : " is invalid";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        firstNameValid: firstNameValid,
        lastNameValid: lastNameValid,
        locationValid: locationValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.firstNameValid && this.state.lastNameValid
    });
  }
  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }
  Searchresult(s) {
    var searchurl =
      "https://api.datafinder.com/qdf.php?service=phone&k2=9abbxna7d2b65ivia3p9vljs&cfg_maxrecs=100&d_first=" +
      s.firstName +
      "&d_last=" +
      s.lastName +
      "&d_state=" +
      s.location;
    fetch(searchurl)
      .then(result => result.json())
      .then(result => {
        const newState = update(this.state, {
          data: {
            $set: result.datafinder.results
          },
          loading: { $set: false }
        });
        this.setState(newState);
        this.btn.removeAttribute("disabled");
      });
  }

  getform() {
    return (
      <div>
        <br />
        <Form inline>
          <FormGroup controlId="formInlineFirstname">
            <ControlLabel>First Name</ControlLabel>{" "}
            <FormControl
              type="text"
              required
              name="firstName"
              placeholder="FirstName"
              value={this.state.firstName}
              onChange={e => this.change(e)}
            />
          </FormGroup>{" "}
          <FormGroup controlId="formInlineLastname">
            <ControlLabel>Last Name</ControlLabel>{" "}
            <FormControl
              type="text"
              required
              name="lastName"
              placeholder="LastName"
              value={this.state.lastName}
              onChange={e => this.change(e)}
            />
          </FormGroup>{" "}
          <FormGroup controlId="formInlinelocation">
            <ControlLabel>State</ControlLabel>{" "}
            <FormControl
              type="text"
              required
              name="location"
              placeholder="Location"
              value={this.state.location}
              onChange={e => this.change(e)}
            />
          </FormGroup>{" "}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!this.state.formValid}
            ref={btn => {
              this.btn = btn;
            }}
            onClick={e => this.onSubmit(e)}
          >
            Submit
          </button>
        </Form>
        <Grid className="panel error">
          <Row>
            <FormErrors formErrors={this.state.formErrors} />
          </Row>
        </Grid>
      </div>
    );
  }
  renderPage() {
    const form = this.getform();
    if (this.state.data !== undefined && this.state.data.length > 0) {
      let resultsList = this.state.data.map((result, index) => (
        <ListGroupItem>
          <Grid>
            <Row>
              <h3>Result # {index + 1}</h3>
            </Row>
            <Row>FirstName: {result.FirstName}</Row>
            <Row>LastName: {result.LastName}</Row>
            <Row>Address: {result.Address}</Row>
            <Row>City: {result.City}</Row>
            <Row>State: {result.State}</Row>
          </Grid>
        </ListGroupItem>
      ));
      return (
        <div className="SearchMain">
          {form}
          <div>
            <ListGroup>{resultsList}</ListGroup>
          </div>
        </div>
      );
    } else if (this.state.data === undefined) {
      return (
        <div className="SearchMain">
          {form}
          <div>
            <ul>
              <h4>No Results Found</h4>
            </ul>
          </div>
        </div>
      );
    } else {
      return <div className="SearchMain">{form}</div>;
    }
  }
  renderwheel() {
    return <LoadingSpinner />;
  }
  render() {
    return this.state.loading ? this.renderwheel() : this.renderPage();
  }
}
