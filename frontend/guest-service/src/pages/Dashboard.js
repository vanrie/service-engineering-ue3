import { useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
    const [events, setEvents] = useState();

    useEffect(() => {
        getEvents.then(res => {
            console.log(res);
            setEvents(res.data);
        })
    }) 
  return (
    <div className="dashboard">
        <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard;
