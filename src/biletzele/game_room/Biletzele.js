import React from "react";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import NewGame from "./NewGame";
import {PendingGames} from "./PendingGames";
export class Biletzele extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { value: "join" };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(value) {
      this.setState({value});
  }

  render() {
      return (

      <div className="margin">
          <ToggleButtonGroup type="radio" value={this.state.value} name="radioAll" onChange={this.handleChange}>
                        <ToggleButton variant="light" name="radio1" value={"new"}>New Game</ToggleButton>
                        <ToggleButton variant="light" name="radio2" value={"join"}>Join Game</ToggleButton>
           </ToggleButtonGroup>
           {this.state.value === "new" ? <NewGame/> : <PendingGames/>}

       </div>);
  }

}