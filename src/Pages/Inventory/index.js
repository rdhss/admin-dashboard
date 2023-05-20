import {  Rate, Space, Table, Typography, Button, Modal, Form, Input, InputNumber, Radio, Upload, Divider, notification  } from "antd";
import { PlusOutlined,  RadiusBottomrightOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getInventory } from "../../API";
import { AllMenu } from "../../API/menu";

import React, { useMemo } from 'react';
const Context = React.createContext({
  name: 'Default',
});

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });


function Inventory() {
  const [MenuList, setMenuList] = useState()
  const [addItem , setAddItem] = useState()
  const [buttonModal , setButtonModal] = useState(true)
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([])
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.info({
      message: `New Menu Success uploaded`,
      placement,
    });
  };
  const contextValue = useMemo(
    () => ({
      name: 'Ant Design',
    }),
    [],
  );

  const handleCancelFile = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChangeFile = ({ fileList: newFileList }) => {setFileList(newFileList); setAddItem({...addItem, url : 'cola.png'})}
  
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  useEffect(() => {
    setLoading(true);
    setTimeout(()=> {
      setLoading(false)
      setMenuList(AllMenu)
    },1000)
  }, []);

  const isNumber = (e) => {
    const allowed = [46, 8, 9, 27, 13, 110, 32];

    if (allowed.indexOf(e.keyCode) !== -1
        // Allow: Ctrl+A, Command+A
        || (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))
        || (e.keyCode === 90 && (e.ctrlKey === true || e.metaKey === true))
        // Allow: home, end, left, right, down, up
        || (e.keyCode >= 35 && e.keyCode <= 40) || (e.keyCode >= 96 && e.keyCode <= 105)) {
      // let it happen, don't do anything
      return;
    }
    if (e.which !== 8 && e.which !== 0 && e.which !== 37 && e.which !== 39 && (e.which < 48 || e.which > 57)) {
      e.preventDefault();
      return false;
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault()
    setAddItem({...addItem, [e.target.name] : e.target.value })
    if("name" in addItem && "price" in addItem && "type" in addItem){
      setButtonModal(false)
    }
  }

  const handleChangeRadion = (e) => {
    e.preventDefault()
    setAddItem({...addItem, [e.target.name] : e.target.value })
    if("name" in addItem && "price" in addItem && "type" in addItem){
      setButtonModal(false)
    }
  }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = (values) => {
    setIsModalOpen(false);
    setLoading(true)
    setTimeout(()=> {
      setLoading(false)
      setMenuList([...MenuList, {...addItem, rating : 0}])
      openNotification('bottomRight')
    },1000)

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values) => {
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <Space className="pl-primary" size={10} direction="vertical">
      <Typography.Title level={4}>Menu List</Typography.Title>
      <>
      <Button type="primary" onClick={showModal}>
        Add Menu
      </Button>
      <Modal
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button disabled={buttonModal} key="submit" type="primary" loading={loading} onClick={handleOk}>
          Submit
        </Button>,]}
      title="Basic Modal" open={isModalOpen}>
      <Form
    name="basic"
    labelCol={{
      span: 5,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    onChange={handleChange}
  >
    <Form.Item
      label="Name"
      rules={[
        {
          required: true,
          message: 'Please input your name',
        },
      ]}
    >
      <Input name="name"/>
    </Form.Item>

    <Form.Item
      label="Price"
      rules={[
        {
          required: true,
          message: 'Please fill price',
        },
      ]}
    >
      <InputNumber prefix="$" name="price" onKeyDown={isNumber}/>
    </Form.Item>

    <Form.Item
      label="Type"
      rules={[
        {
          required: true,
          message: 'Please chose type',
        },
      ]}
    >
    <Radio.Group name="type" onChange={handleChangeRadion}>
        <Radio.Button value="Burger">Burger</Radio.Button>
        <Radio.Button value="Sides">Sides</Radio.Button>
        <Radio.Button value="Drinks">Drinks</Radio.Button>
      </Radio.Group>
    </Form.Item>

    <Form.Item
      label="Photo"
      rules={[
        {
          required: true,
          message: 'Please fill photo',
        },
      ]}
    >
    <Upload
        name="url"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChangeFile}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelFile}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </Form.Item>
    

  </Form>
      </Modal>
    </>
      <Table
        loading={loading}
        columns={[
          {
            title: "Thumbnail",
            dataIndex: "url",
            render: (t,r) => <img width={70} className="rounded" src={require(`../../assets/img/${r.type === 'undefined.jpg' ? 'cola.png' : r.url}`)}/> 
            // render: (t,r) => <img width={70} className="rounded" src={previewImage}/> 
          },
          {
            title: "Title",
            dataIndex: "name",
          },
          {
            title: "Price",
            dataIndex: "price",
            sorter: (a, b) => a.price - b.price,
            render: (value) => <span>${value}</span>,
          },
          {
            title: "Rating",
            dataIndex: "rating",
            sorter: (a, b) => a.rating - b.rating,
            render: (rating) => {
              return <Rate value={rating} allowHalf disabled />;
            },
          },
          {
            title: "Category",
            dataIndex: "type",
          },
        ]}
        dataSource={MenuList}
        pagination={{
          pageSize: 5,
        }}
      ></Table>
            <Context.Provider value={contextValue}>
      {contextHolder}
    </Context.Provider>

    </Space>
  );
}
export default Inventory;
