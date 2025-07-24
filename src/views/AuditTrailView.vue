<script setup="ts">
    import { getActivityLogs } from "@/audittrail/queries";
    import { onMounted, ref } from "vue"

    const activities=ref([])
    const sortKey = ref('')
    const sortOrder = ref('asc')
    const userId = localStorage.getItem('user_id')

    const loadActivities = async () => {
        try {
            const result = await getActivityLogs(parseInt(userId))
            if (result.success) {
                activities.value = result.Items
            }
        } catch (error) {
            console.error('Error loading activities:', error)
            activities.value = []
        }
    }
    
    onMounted(() => {
        loadActivities();
    });

    const sortedActivities = computed(() => {
        if (!sortKey.value) return activities.value
        
        return [...activities.value].sort((a, b) => {
            let modifier = sortOrder.value === 'asc' ? 1 : -1
            
            // Handle different data types
            let aVal = a[sortKey.value]
            let bVal = b[sortKey.value]
            
            // Convert to strings for comparison if needed
            if (typeof aVal === 'string') aVal = aVal.toLowerCase()
            if (typeof bVal === 'string') bVal = bVal.toLowerCase()
            
            if (aVal < bVal) return -1 * modifier
            if (aVal > bVal) return 1 * modifier
            return 0
        })
    })

    const sortTable = (key) => {
        if (sortKey.value === key) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortKey.value = key
            sortOrder.value = 'asc'
        }
    }

</script>
<template>
    <body id="audit-trail-page">
        <main>
            <header>Activity Log</header>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th @click="sortTable('CredID')" class="sortable">
                                Activity Name
                                <span v-if="sortKey === 'CredID'">
                                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th @click="sortTable('ActivityName')" class="sortable">
                                Activity Name
                                <span v-if="sortKey === 'ActivityName'">
                                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th @click="sortTable('Date')" class="sortable">
                                Date
                                <span v-if="sortKey === 'Date'">
                                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th @click="sortTable('IP')" class="sortable">
                                Location
                                <span v-if="sortKey === 'IP'">
                                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="activity in sortedActivities" :key="activity.LogID">
                            <td>{{ activity.ActivityName }}</td>
                            <td>{{ activity.Date }}</td>
                            <td>{{ activity.IP }}</td>
                            <td>{{ activity.Timestamp }}</td>
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