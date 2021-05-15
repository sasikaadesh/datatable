import * as React from "react"
import { useEffect, useState, useContext } from "react"
import { DataGrid } from "@material-ui/data-grid"
import { TextField } from "@material-ui/core"
import { randomCreatedDate, randomTraderName, randomUpdatedDate } from "@material-ui/x-grid-data-generator"
import Axios from "axios"

const columns = [
  { field: "firstName", headerName: "FirstName", width: 180, editable: true },
  { field: "username", headerName: "username", width: 180, editable: true },
]

const rows = [
  {
    id: 1,
    name: randomTraderName(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
]

export default function App() {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("admin")
  const [data, setData] = useState([])

  async function getLogin() {
    try {
      const response = await Axios.post("https://localhost:44347/api/v1/Authorization/authenticate", { username, password })
      if (response.data) {
        localStorage.setItem("appToken", response.data.token)
        localStorage.setItem("appFirstName", response.data.firstName)
        console.log(response.data)
        const accessToken = localStorage.getItem("appToken")
        const authAxios = Axios.create({ headers: { Authorization: "Bearer " + accessToken } })
        const resp = await authAxios.get("https://localhost:44347/api/v1/Users")
        console.log(resp)
        return resp
      } else {
        console.log("Incorrect username / password.")
      }
    } catch (e) {
      console.log("There was a problem")
    }
  }

  useEffect(() => {
    getLogin().then((res) => {
      setData(res.data)
    }, [])
  }, [])

  const [filteredRows, setFilteredRows] = React.useState([...data])

  const onChange = (e) => {
    const { value } = e.target
    console.log(value)
    const _filtered = filteredRows.filter((row) => row.firstName.toLowerCase().includes(value.toLowerCase()))
    if (value) {
      setFilteredRows(_filtered)
    } else {
      setFilteredRows(data)
    }
  }
  return (
    <div style={{ height: 300, width: "100%" }}>
      <TextField placeholder="Search" variant="outlined" onChange={onChange} />
      <div style={{ margin: 4 }}></div>
      <DataGrid rows={filteredRows} columns={columns} />
    </div>
  )
}
