/* eslint-disable array-callback-return */

import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import ExercisesList from "./exercises-children/ExercisesList";
import ExercisesCard from "./exercises-children/ExercisesCard";
import ExercisesCardDetailed from "./exercises-children/ExercisesCardDetailed";
import "./Exercises.css";

class Exercises extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      images: "",
      currentExerciseId: true,
      showModal: false,
    };
  }

  componentDidMount() {
    console.log("hello");
    this.fetchExercises();
  }
  // componentDidUpdate() {
  //   // console.log("hello");
  //   this.fetchExercises();
  // }

  bodyPartNumberGenerator = (bodyPartString) => {
    switch (bodyPartString) {
      case "abs":
        return 10;
      case "arms":
        return 8;
      case "back":
        return 12;
      case "calves":
        return 14;
      case "chest":
        return 11;
      case "legs":
        return 9;
      case "shoulders":
        return 13;
      default:
        return 10;
    }
  };

  fetchExercises = () => {
    let bodyPartCategoryNumber = this.bodyPartNumberGenerator(
      this.props.match.params.bodypart
    );

    // First we get all of the exercises
    axios
      .get(
        `https://wger.de/api/v2/exercise/?language=2&category=${bodyPartCategoryNumber}&limit=80`
      )
      .then((response) => {
        let exercises = response.data.results;
        let images;

        // Then here below we get all of the images
        axios
          .get(`https://wger.de/api/v2/exerciseimage/?language=2&limit=204`)
          .then((response) => {
            images = response.data.results;
            // Reassign the exercises to include the correct images
            exercises = exercises
              .map((exercise) => {
                // we maintain the exercise now adding all of the images with the images property
                exercise = {
                  ...exercise,
                  images: images.filter(
                    (image) => image.exercise === exercise.id
                  ),
                };

                // If there is images in this exercise return it to the new array
                if (exercise.images.length) {
                  return exercise;
                }
              })
              // filter out any undefined elements so that we only have the exercises with images
              .filter((element) => element !== undefined);
            this.setState({ exercises: exercises });
          });
      });
  };
  displayPopUpCard = (item) => {
    this.setState({ currentExerciseId: item.id });
    this.openModal();
  };

  openModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    return (
      <div className="exercisesList">
        {this.state.exercises.map((item) => (
          <div>
            <ExercisesCard
              item={item}
              displayPopUpCard={this.displayPopUpCard}
            />
          </div>
        ))}
        {this.state.showModal ? (
          <ExercisesCardDetailed
            {...this.state.exercises.filter(
              (exercise) => exercise.id === this.state.currentExerciseId
            )[0]}
            closeModal={this.closeModal}
          />
        ) : null}
        <ExercisesList key={"Exercises' List"} />
      </div>
    );
  }
}

// specifying default props + expected prop types
Exercises.defaultProps = {
  name: "xx",
};

Exercises.propTypes = {
  name: PropTypes.string,
};

export default Exercises;
