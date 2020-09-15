import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

//글씨 입력하고 리스트창 만드는거임.
export default class ToDo extends Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false, toDoValue: props.text };
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteToDo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    uncompleteToDo: PropTypes.func.isRequired,
    completeToDo: PropTypes.func.isRequired,
    updateToDo: PropTypes.func.isRequired,
  };
  render() {
    const { isEditing, isCompleted, toDoValue } = this.state;
    const { text, id, deleteToDo } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            <View
              style={[styles.circle, isCompleted ? styles.completeCircle : styles.uncomplatedCircle]}
            ></View>
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              style={[styles.text, styles.input, isCompleted ? styles.completedText : styles.uncompletedText]}
              value={toDoValue}
              multiline={true}
              onChangeText={this._controllInput}
              returnKeyType={"done"}
              onBlur={this._finishEditing} //입력하다가 칸 밖 클릭하면 편집종료.
            />
          ) : (
            <Text style={[styles.text, isCompleted ? styles.completedText : styles.uncompletedText]}>
              {text}
            </Text>
          )}
        </View>
        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>💎</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._startEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>⚔</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPressOut={(event) => {
                event.stopPropagation;
                deleteToDo(id);
              }}
            >
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>🗑</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  _toggleComplete = (event) => {
    event.stopPropagation();
    const { isCompleted, uncompleteToDo, completeToDo, id } = this.props;
    if (isCompleted) {
      uncompleteToDo(id);
    } else {
      completeToDo(id);
    }
  };
  _startEditing = (event) => {
    event.stopPropagation();
    const { text } = this.props;
    this.setState({ isEditing: true, toDoValue: text });
  };
  _finishEditing = (event) => {
    event.stopPropagation();
    const { toDoValue } = this.state;
    const { id, updateToDo } = this.props;
    updateToDo(id, toDoValue);
    this.setState({ isEditing: false });
  };
  _controllInput = (text) => {
    this.setState({ toDoValue: text });
  };
}

//TOuchableOpacity 저건 클릭으로 흐릿하게 가능.

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth, //아래선
    flexDirection: "row",
    alignItems: "center", //위아래 가운데정렬 ㅋ, 원을 가운데로
    justifyContent: "space-between",
  },
  circle: {
    width: 30, //원 디자인
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20,
  },
  completeCircle: {
    borderColor: "#bbb", //원 클릭 색 바뀜
  },
  uncomplatedCircle: {
    borderColor: "#F23657", //원 클릭 색 바뀜
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20, //상단과 하단을 뜻함
  },
  completedText: {
    borderColor: "#bbb",
    textDecorationLine: "line-through", //글에 라인 긋는거
  },
  uncompletedText: {
    color: "#353839",
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2,
  },
  actions: {
    flexDirection: "row", //검, 휴지통이 세로로 있던거 가로로
  },
  actionContainer: {
    marginVertical: 10, //근처에서도 클릭 가능하게 마진을 줌
    marginHorizontal: 10,
  },
  actionText: { fontSize: 20 },
  input: { marginVertical: 15, width: width / 2 },
});
