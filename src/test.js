import React, { Component } from "react";
import { Modal, Text, TouchableHighlight, View } from "react-native";

export default class ModalExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View style={{ marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          style={{ height: 60, backgroundColor: "red" }}
          onRequestClose={() => {
            alert("Modal has been closed.");
          }}
          transparent={true}
        >
          <View
            style={{
              marginTop: 400,
              height: 300,
              width: 300,
              backgroundColor: "#ccc"
            }}
          >
            <View>
              <Text>Hello World!</Text>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text>Show Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
