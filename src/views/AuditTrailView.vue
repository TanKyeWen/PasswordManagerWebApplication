<script setup="ts">
    import { getActivitiesLogs } from "@/audittrail/queries";
    import { onMounted, ref, computed } from "vue"
    import { useRouter, RouterLink } from 'vue-router';

    const router = useRouter()
    const logs=ref([])
    const sortKey = ref('')
    const sortOrder = ref('asc')
    const userId = localStorage.getItem('user_id')

    async function loadLogs(){
        try {
            const result = await getActivitiesLogs(parseInt(userId))
            console.log('Logs loaded:', result)

            if (result.success) {
                logs.value = result.data.map((log) => ({
                    LogID:        log.log_id,
                    UserID:       log.user_id,
                    CredID:       log.cred_id,
                    ActivityName: log.activity_name,
                    Date:         log.date,
                    IP:           log.ip,
                    Timestamp:    log.timestamp
                }))
                console.log('Mapped Logs:', logs.value)
            } else if (result.code === 401 || result.code === 403) {
                console.log('Unauthorized Access:', result.error)
                router.push('/signIn')
            } else {
                console.error('Error fetching Logs:', result.error)
            }
        } catch (error) {
            console.error('Error loading Logs:', error)
            logs.value = []
        }
    }
    
    onMounted(() => {
        loadLogs();
    });

    const sortedLogs = computed(() => {
        if (!sortKey.value) return logs.value
        
        return [...logs.value].sort((a, b) => {
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
            <header>Audit Trail</header>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th @click="sortTable('IP')" class="sortable">
                                IP Address
                                <span v-if="sortKey === 'IP'">
                                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th @click="sortTable('CredID')" class="sortable">
                                Credential ID (if any)
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
                            <th @click="sortTable('Timestamp')" class="sortable">
                                Time
                                <span v-if="sortKey === 'Timestamp'">
                                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="log in sortedLogs" :key="log.LogID">
                            <td>{{ log.IP }}</td>
                            <td>{{ log.CredID }}</td>
                            <td>{{ log.ActivityName }}</td>
                            <td>{{ log.Date }}</td>
                            <td>{{ log.Timestamp }}</td>
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