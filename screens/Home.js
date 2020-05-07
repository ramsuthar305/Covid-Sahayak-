import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Picker,

} from "react-native";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Columns from "./components/CoronaStatusColumn";
import * as All from '../assets/flags/flags';
import LottieView from 'lottie-react-native';


const fetchFonts = () => {
  console.log("loading font");
  return Font.loadAsync({
    "Nunito-regular": require("../assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
  });
};

export default function Home() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [Data, setData] = useState([]);
  const [Month, setMonth] = useState(null);
  const [DataLoading, setDataLoading] = useState(true);
  const [CountryData, setCountryData] = useState(null);
  const [CurrentMonthCountryData, setCurrentMonthCountryData] = useState([]);
  const [CurrentMonthCases, setCurrentMonthCases] = useState(null);
  const [CurrentMonthRecovered, setCurrentMonthRecovered] = useState(null);
  const [CurrentMonthDeath, setCurrentMonthDeath] = useState(null);
  const [SelectedCountry, setSelectedCountry] = useState("India");
  const [countryList, setCountryList] = useState([]);


  useEffect(() => {
    async function fetchMyAPI() {
      let response = await fetch("https://api.covid19api.com/summary");
      setData(await response.json());

    }
    fetchMyAPI();
  }, []);

  useEffect(() => {
    async function fetchCurrentMonthCountryData() {
      let response = await fetch("https://api.covid19api.com/dayone/country/" + SelectedCountry);
      setCurrentMonthCountryData(await response.json());

    }
    fetchCurrentMonthCountryData();
  }, [SelectedCountry]);


  useEffect(() => {
    console.log('Called' + Data.length)
    if (Data.length != 0 && CurrentMonthCountryData.length != 0) {
      console.log(countryList)
      //console.log(JSON.stringify(CurrentMonthCountryData))
      let today = new Date().getDate()
      setMonth(new Date().toString().split(" ")[1])
      setDataLoading(false)
      const country = Data.Countries.filter(country => {
        if (country.Country == SelectedCountry) { return country }

      })
      setCountryData(country[0])
      setCurrentMonthCases(CurrentMonthCountryData[CurrentMonthCountryData.length - 1].Confirmed - CurrentMonthCountryData[CurrentMonthCountryData.length - today - 1].Confirmed)
      setCurrentMonthRecovered(CurrentMonthCountryData[CurrentMonthCountryData.length - 1].Recovered - CurrentMonthCountryData[CurrentMonthCountryData.length - today - 1].Recovered)
      setCurrentMonthDeath(CurrentMonthCountryData[CurrentMonthCountryData.length - 1].Deaths - CurrentMonthCountryData[CurrentMonthCountryData.length - today - 1].Deaths)
      console.log(CurrentMonthCountryData[CurrentMonthCountryData.length - today - 1].Confirmed)
    }
  }, [Data, CurrentMonthCountryData])


  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
      />
    );
  }
  if (DataLoading) {
    return (<LottieView
      autoPlay loop
      source={require('../assets/images/coronaLoading.json')}
    />);
  } else {
    return (
      <ScrollView>
        <SafeAreaView style={style.safeArea}>
          <StatusBar translucent color="black" backgroundColor="black" />
          <View style={style.header}>
            <Image
              source={require("../assets/images/menu.png")}
              style={style.menu}
            />
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../assets/images/corona.png")}
                style={style.menu}
              />
              <Text style={style.headerTitle}> Sahayak</Text>
            </View>
          </View>
          <View style={{ marginTop: "6%" }} elevation={2}>
            <TouchableOpacity>
              <View style={style.healthStatus}>
                <Text style={style.healthStatusHeading}>
                  Report your COVID-19 health status.
              </Text>
                <Text style={style.healthStatusTagline}>
                  Take 1 minute every day, to report your health status and help us
                  map the spread of corona virus.
              </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: "6%" }}>
            <TouchableOpacity>
              <View style={style.GlobalStatus} elevation={3}>
                <Text style={style.GlobalStatusHeading}>Coronavirus Global</Text>
                <Columns
                  cases={Data.Global.TotalConfirmed.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  deaths={Data.Global.TotalDeaths.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  cured={Data.Global.TotalRecovered.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                />
                <Text style={style.lastUpdated}>Last updated Apr 08, 03:54 PM</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: "6%" }}>

            <View style={style.GlobalStatus} elevation={3}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", flex: 2 }}>
                  <Image
                    source={All[`${SelectedCountry}`]}
                    style={style.menu}
                  />
                  <Text style={style.GlobalStatusHeading}> {SelectedCountry}</Text>
                </View>
                <View style={{ flex: 1, marginTop: "-4%" }}>

                  <Picker
                    selectedValue={SelectedCountry}
                    onValueChange={(country) => { setDataLoading(true); setSelectedCountry(country) }}
                    mode="dialog"
                    textStyle={{ color: "black", fontFamily: "Nunito-SemiBold" }} >

                    {Data.Countries.map((country, i) => {
                      console.log(country.Country)
                      return (<Picker.Item key={i} value={country.Country} label={country.Country} />)
                    })}

                  </Picker>
                </View>

              </View>

              <Columns
                cases={CountryData.TotalConfirmed.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                deaths={CountryData.TotalDeaths.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                cured={CountryData.TotalRecovered.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                month={Month}
                currentMonthCases={"+ " + CurrentMonthCases.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                currentMonthRecovered={"+ " + CurrentMonthRecovered.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                currentMonthDeath={"+ " + CurrentMonthDeath.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
              />
              <Text style={style.lastUpdated}>Last updated Apr 08, 03:54 PM</Text>
            </View>

          </View>
          <Text style={[style.GlobalStatusHeading, { marginTop: "4%" }]}>
            Latest COVID-19 news
        </Text>
          <View style={{ marginVertical: "3%" }}>
            <TouchableOpacity>
              <View style={style.GlobalStatus} elevation={3}>
                <View style={{ flexDirection: "row" }}>
                  <Entypo name="news" size={24} color="black" style={{ flex: 1 }} />
                  <Text style={style.newsHeadline}>
                    {" "}
                  Lockdown 3.0 to be estended till 17 may
                </Text>
                  <Ionicons name="ios-arrow-forward" size={24} color="#636e72" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }

}

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: StatusBar.currentHeight + 10,
    paddingHorizontal: "3%",
  },
  menu: {
    height: 25,
    width: 22,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 20,
    color: "#636e72",
  },
  healthStatus: {
    backgroundColor: "#EA2027",
    borderRadius: 15,
    padding: "5%",
  },
  GlobalStatus: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: "5%",
  },
  healthStatusHeading: {
    color: "white",
    fontFamily: "Nunito-Bold",
    fontSize: 18,
  },
  healthStatusTagline: {
    color: "white",
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    marginTop: "3%",
  },
  GlobalStatusHeading: {
    color: "black",
    fontFamily: "Nunito-Bold",
    fontSize: 20,
  },
  lastUpdated: {
    fontFamily: "Nunito-regular",
  },
  newsHeadline: {
    fontSize: 17,
    fontFamily: "Nunito-regular",
    flex: 8,
  },
});
