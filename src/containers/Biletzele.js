import React from "react";
import {ToggleButton, ButtonGroup, ToggleButtonGroup} from "react-bootstrap";
import NewGame from "./NewGame";
import {PendingGames} from "./PendingGames";

export class Biletzele extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { value: 1 };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(value) {
        this.setState({value});
  }

  render() {
      return (

      <div className="margin">
          <ToggleButtonGroup type="radio" value={this.state.value} name="radioAll" onChange={this.handleChange}>
                        <ToggleButton variant="primary" name="radio1" value={1}>New Game</ToggleButton>
                        <ToggleButton variant="info" name="radio2" value={2}>Join Game</ToggleButton>
           </ToggleButtonGroup>
           {this.state.value === 1 ? <NewGame/> : <PendingGames/>}

       </div>);
  }

}