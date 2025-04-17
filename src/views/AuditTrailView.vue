<script>
    export default {
        data() {
            return {
                activities: [
                    { id: 1, activityName: 'Add', date: '2025-04-15', location: 'Tokyo', operatingSystem: 'Windows' },
                    { id: 2, activityName: 'Delete', date: '2025-04-14', location: 'New York', operatingSystem: 'MacOS' },
                    { id: 3, activityName: 'Attempted Login', date: '2025-04-13', location: 'London, Burmingham, Manhattan', operatingSystem: 'Linux' },
                ],
                sortKey: 'date',
                sortOrder: 'asc',
            };
        },
        computed: {
            sortedActivities() {
                return this.activities.sort((a, b) => {
                    let modifier = this.sortOrder === 'asc' ? 1 : -1;
                    if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
                    if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
                    return 0;
                });
            },
        },
        methods: {
            sortTable(key) {
                if (this.sortKey === key) {
                    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortKey = key;
                    this.sortOrder = 'asc';
                }
            },
        },
    };
</script>
<template>
    <body id="audit-trail-page">
        <main>
            <header>Activity Log</header>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th @click="sortTable('activityName')">Activity Name</th>
                            <th @click="sortTable('date')">Date</th>
                            <th @click="sortTable('location')">Location</th>
                            <th @click="sortTable('operatingSystem')">Operating System</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="activity in sortedActivities" :key="activity.id">
                            <td>{{ activity.activityName }}</td>
                            <td>{{ activity.date }}</td>
                            <td>{{ activity.location }}</td>
                            <td>{{ activity.operatingSystem }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </body>
</template>

<style scoped>
    #audit-trail-page{
        font-family: 'Montserrat', sans-serif;
        border-radius: 25px;
        background-color: #593939;
        color: #DFD5C3;
        margin: 10px;
        padding: 25px;
        height: calc(100% - 35px);
        width: calc(100% - 40px);
        box-sizing: border-box;
    }
    header{
        font-size: 25px;
        font-weight: 600;
        margin-bottom: 25px;
    }
    table{
        width: 100%;
        border: 2px solid #DFD5C3;
        border-collapse: collapse;
    }
    th, td{
        padding: 12px;
        text-align: left;
        cursor: pointer;
        border-bottom: 1px solid #DFD5C3;
    }
    th{
        font-size: 20px;
        font-weight: 500;
    }
</style>