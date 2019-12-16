import * as axios from 'axios'

async function main() {
  const host = 'forum-api.lecom.cloud'
  const jwt = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhM2VhM2U4NGYxMjRjMDczMWE0MGI0OGU2ZjYwZDM5MjBjYTFhMjNlNDVmNjhmYjFlYzk2MjVlMjE4NWM4MTIifQ.Ec7lIC2qAJl0IkU5xKVloUQrBuNGYFKxmfrepEsUNc3cNULe-30YsKJC8luHkpZBBeUS7zsNXCIPT8XZNJMYrA'

  for (let i = 2; i < 1000; i++) {
    console.log(i)

    try {
      const response = await axios.default({
        method: 'post',
        url: `https://${host}/reply/createReply`,
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
        data: {
          postId: "20191214043906247_7fGpYVAM",
          title: `${i}`,
          paragraphs: [
            `${i}`
          ]
        }
      });

      console.log(response.data)
    } catch (err) {
      const axiosError = err as axios.AxiosError<any>
      const response = axiosError.response as axios.AxiosResponse

      console.log(response.data)
    }
  }
}

main()
  .then(() => {
    console.log('Completed.');
  })
  .catch(err => {
    // Deal with the fact the chain failed
  });