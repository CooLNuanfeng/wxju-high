export default {
  getCanvasContext(id){
    return new Promise((resolve,reject)=>{
      const query = wx.createSelectorQuery()
      query.select('#'+id)
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          resolve({ctx, canvas})
        })
    })
  }
}