import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

const CreateEmployee = ({ navigation, route }) => {
  const getDetails = (type) => {
    if (route.params) {
      switch (type) {
        case "name":
          return route.params.name;
        case "phone":
          return route.params.phone;
        case "email":
          return route.params.email;
        case "salary":
          return route.params.salary;
        case "picture":
          return route.params.picture;
        case "position":
          return route.params.position;
      }
    }
    return "";
  };
  const [name, setName] = useState(getDetails("name"));
  const [phone, setPhone] = useState(getDetails("phone"));
  const [email, setEmail] = useState(getDetails("email"));
  const [salary, setSalary] = useState(getDetails("salary"));
  const [picture, setPicture] = useState(getDetails("picture"));
  const [position, setPosition] = useState(getDetails("position"));
  const [modal, setModal] = useState(false);
  const [enableshift, setEnableShift] = useState(false);

  const submitData = () => {
    fetch("http://10.0.2.2:3000/send-data", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        salary,
        picture,
        position,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${data.name} Saved Successfully`);
        navigation.navigate("Home");
      })
      .catch((err) => {
        Alert.alert("Something went wrong");
      });
  };

  const updateDetails = () => {
    fetch("http://10.0.2.2:3000/update", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: route.params._id,
        name,
        phone,
        email,
        salary,
        picture,
        position,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${data.name} Updated Successfully`);
        navigation.navigate("Home");
      })
      .catch((err) => {
        Alert.alert("Something went wrong");
      });
  };

  const pickFromGallery = async () => {
    const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!data.cancelled) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(".")[1]}`,
        };
        handleUpload(newfile);
      }
    } else {
      Alert.alert("You need to give us permission ");
    }
  };

  const pickFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!data.cancelled) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(".")[1]}`,
        };
        handleUpload(newfile);
      }
    } else {
      Alert.alert("You need to give us permission ");
    }
  };

  const handleUpload = (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "employeeApp");
    data.append("cloud_name", "velocityy");

    fetch("https://api.cloudinary.com/v1_1/velocityy/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPicture(data.url);
        setModal(false);
      })
      .catch((err) => {
        Alert.alert("Error while uploading");
      });
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={styles.root}
      enabled={enableshift}
    >
      <View>
        <TextInput
          label="Name"
          style={styles.inputStyle}
          value={name}
          onFocus={() => setEnableShift(false)}
          mode="outlined"
          theme={theme}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          label="Email"
          style={styles.inputStyle}
          value={email}
          onFocus={() => setEnableShift(false)}
          mode="outlined"
          theme={theme}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label="Phone"
          style={styles.inputStyle}
          value={phone}
          onFocus={() => setEnableShift(false)}
          keyboardType={"numeric"}
          maxLength={10}
          mode="outlined"
          theme={theme}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          label="Salary"
          style={styles.inputStyle}
          value={salary}
          onFocus={() => setEnableShift(true)}
          mode="outlined"
          theme={theme}
          onChangeText={(text) => setSalary(text)}
        />
        <TextInput
          label="Position"
          style={styles.inputStyle}
          value={position}
          onFocus={() => setEnableShift(true)}
          mode="outlined"
          theme={theme}
          onChangeText={(text) => setPosition(text)}
        />

        <Button
          style={styles.inputStyle}
          theme={theme}
          icon={picture == "" ? "upload" : "check"}
          mode="contained"
          onPress={() => setModal(true)}
        >
          Upload Image
        </Button>
        {route.params ? (
          <Button
            style={styles.inputStyle}
            theme={theme}
            icon="content-save"
            mode="contained"
            onPress={() => updateDetails()}
          >
            Update
          </Button>
        ) : (
          <Button
            style={styles.inputStyle}
            theme={theme}
            icon="content-save"
            mode="contained"
            onPress={() => submitData()}
          >
            Save
          </Button>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            //Clicking of back Button on requeset will close
            setModal(false);
          }}
          visible={modal}
        >
          <View style={styles.modalView}>
            <View style={styles.modalButtonView}>
              <Button
                icon="camera"
                theme={theme}
                mode="contained"
                onPress={() => pickFromCamera()}
              >
                Camera
              </Button>

              <Button
                icon="image-area"
                theme={theme}
                mode="contained"
                onPress={() => pickFromGallery()}
              >
                Gallery
              </Button>
            </View>
            <Button theme={theme} onPress={() => setModal(false)}>
              Cancel
            </Button>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const theme = {
  colors: {
    primary: "#006aff",
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  inputStyle: {
    margin: 2,
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  modalView: {
    position: "absolute",
    bottom: 2,
    width: "100%",
  },
});

export default CreateEmployee;
