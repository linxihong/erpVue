<template>
    <p>
        <input type="file" :id="id" @change="doUpload" style="width: 20%"/>
        progress:{{percentage}}
        url:{{url}}
    </p>
</template>

<script>
    export default {
        name: 'upload',
        data () {
            return {
                id: 'upload',
                percentage: 0,
                url: null,
            }
        },
        methods:{
            doUpload () {
                const _this = this;
                this.getAjax('/sys/unique/getUploadPortraitSign').then(result => {
                    const client = new OSS.Wrapper({
                        region: result.data.regionName,
                        accessKeyId: result.data.accessKeyId,
                        accessKeySecret: result.data.accessKeySecret,
                        stsToken: result.data.securityToken,
                        bucket: result.data.bucketName
                    });
                    const files = document.getElementById(_this.id);
                    if (files.files) {
                        const fileLen = document.getElementById(_this.id).files;
                        for (let i = 0; i < fileLen.length; i++) {
                            const file = fileLen[i];
                            const storeAs = file.name;
                            client.multipartUpload(result.data.uploadUrl + storeAs, file, {
                                progress: function* (percentage, cpt) {
                                    // 上传进度
                                    _this.percentage = percentage
                                }
                            }).then(result => {
                                // 上传完成
                                this.url = result.res.requestUrls;
                                console.log(result);
                            }).catch((err) => {
                                console.log(err)
                            })
                        }
                    }
                })
            }
        }
    }
</script>