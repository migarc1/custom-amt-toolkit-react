import './App.css';
import KVM from './UI';

function App() {

  return (
    <div className="App">
        <KVM deviceId="64616825-6585-42a6-914a-b63e65b55e42" //Replace with AMT Device GUID
        mpsServer="https://amt.endpointcloudservices.intel.com/mps/ws/relay" //Replace 'localhost' with Development System or MPS Server IP Address
        mouseDebounceTime={200}
        authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IiIsImlzcyI6ImFkbWluLWlzc3VlciIsImRldmljZUlkIjoiNjQ2MTY4MjUtNjU4NS00MmE2LTkxNGEtYjYzZTY1YjU1ZTQyIiwiZXhwIjoxNzMxMzQ5MjU4fQ.Lt9JN9FZDqELaHapRmEmt67s1ouVOMt4n6v7RiBwxfw"
        canvasHeight="100%"
        canvasWidth="100%"></KVM>
    </div>
);
}

export default App