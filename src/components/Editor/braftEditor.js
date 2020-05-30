import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import 'braft-extensions/dist/table.css';

import React from 'react';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import ColorPicker from 'braft-extensions/dist/color-picker';
import Table from 'braft-extensions/dist/table';
import { Upload, message } from 'antd';
import {PictureOutlined} from '@ant-design/icons'
import './braftEditor.less';

BraftEditor.use(ColorPicker({
    includeEditors: ['editor-with-color-picker'],
    theme: 'light', // 支持dark和light两种主题，默认为dark
}));
  
BraftEditor.use(Table({
    defaultColumns: 3, // 默认列数
    defaultRows: 3, // 默认行数
    withDropdown: false, // 插入表格前是否弹出下拉菜单
    // exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
}));
export default class RichEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          initialValue: this.props.initialValue,
          editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
          uploadPicture: '/services/attachment/file/upload/AttachmentUpload',
          readOnly: false,
        };
    }
    componentDidMount () {
      this.setState({
        editorState: BraftEditor.createEditorState(this.props.initialValue || ''), // 设置编辑器初始内容
      });
      if(this.props.onChange) {
        this.props.onChange(this.props.initialValue || '')
      }
    }
    componentDidUpdate(prevProps) {
      if (this.props.initialValue !== prevProps.initialValue) {
        this.setState({
          editorState: BraftEditor.createEditorState(this.props.initialValue || ''), // 设置编辑器初始内容
        });
        if(this.props.onChange) {
          this.props.onChange(this.props.initialValue || '')
        }
      }
    }
    handleChange = (editorState) => { //编辑器内值改变触发的函数
        this.setState({
            editorState: editorState,
        });
        let html = editorState.toHTML();
        if(this.props.onChange) {
          if(html === '<p></p>') {
            this.props.onChange('')
          }else {
            this.props.onChange(html)
          }
        }
    }
    beforeUpload = (file) => {
        const isPic=file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/bmp'||file.type === 'image/gif';
        if (!isPic) {
            Message.error('仅支持上传JPG/JPEG/PNG/GIF格式图片!');
            return false;
        }
    }
    uploadHandler = info => { // 插入图片上传到服务器
        const {file, fileList} = info
    if (file.status === 'uploading') {
      this.setState({ fileList, uploading: true });
    } else {
      this.setState({ uploading: false });

      switch (file.status) {
        case 'done':
          if(file && file.response && file.response.sucess) {
            message.success('上传成功')
            this.setState({fileList})
            let id = file.response && file.response.entity && file.response.entity[0] && file.response.entity[0].id
            this.setState({
              editorState: ContentUtils.insertMedias(this.state.editorState, [{
                type: 'IMAGE',
                url: `/services/yjenforcement/attachmentFile/scan/${id}`,
              }]),
            });
          } else {
            message.error('上传失败');
          }
          break;
        case 'error':
          message.error(`上传失败${file.status}`);
          break;
        case 'removed':
          // if (this.props.onFileChange) {
          //   this.props.onFileChange(fileList);
          // }
          this.setState({fileList})
      }
    }
        
    }
    showPreview = () => { //预览点击时modal中加入html
        setTimeout(() => {
            // document.getElementById('previewContent').innerHTML = this.state.editorState.toHTML()
            document.getElementById('editor-previewContent').innerHTML = this.state.contentHTML;
        }, 500);
        
    }
    render () {
        const { editorState } = this.state;
        const excludeControls = ['emoji', 'code', 'media'];
        const extendControls = [
            {
              key: 'antd-uploader',
              type: 'component',
              component: (
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    action={this.state.uploadPicture}
                    // customRequest={this.uploadHandler}
                    beforeUpload={this.beforeUpload}
                    onChange={this.uploadHandler}
                >
                  {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                  <button type="button" className="control-item button upload-button" data-title="插入图片">
                    {/* <Icon type="picture" theme="filled" /> */}
                    <PictureOutlined />
                  </button>
                </Upload>
              ),
            },
            {
                key: 'custom-modal',
                type: 'modal',
                text: '预览',
                onClick: this.showPreview,
                modal: {
                  id: 'preview',
                  showCancel: false,
                  showConfirm: true,
                  confirmable: true,
                //   title: '预览',
                  children: (
                    <div id='editor-previewContent' style={{width: 375,height:580, padding: '0 10px'}}>
                      {/* {this.state.editorState.toHTML()} */}
                    </div>
                  ),
                },
            },
          ];
        const imageControls = [
            'float-left',
            'float-right',
            'align-left', // 设置图片居左
            'align-center', // 设置图片居中
            'align-right', // 设置图片居右
            // 'size',
            'remove',
        ];
        return (
        <div>
            <div className="editor-wrapper" style={{border: '1px solid #ccc'}}>
            <BraftEditor
                id="editor-with-color-picker"
                value={editorState}
                onChange={this.handleChange}
                excludeControls={excludeControls}
                // extendControls={extendControls}
                // imageControls={imageControls}
                imageResizable={false}
                readOnly={this.props.disabled?true:false}
            />
            </div>
        </div>
        );

    }

}