"use client"
import { invoke } from "@tauri-apps/api/tauri"
import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { Fragment, useCallback, useEffect, useState } from "react"
import { readBinaryFile, BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import { open } from "@tauri-apps/api/dialog"
import { useGlobalShortcut } from "@/hooks/tauri/shortcuts"
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Layout,
  Space,
  Spin,
  Switch,
  Upload,
  message,
  theme,
} from "antd"
import { StyleProvider } from "@ant-design/cssinjs"
import { useFormik } from "formik"
import { Xboost } from "@/models/Xboost"
import { UploadChangeParam } from "antd/es/upload"
import { UploadFile, UploadProps } from "antd/lib"
import { RcFile } from "antd/lib/upload"
import { fileCheckTotalSize } from "@/finder/hashFinder"
const { Dragger } = Upload
import { useAppSelector, useAppDispatch } from "../hooks"
import { increment } from "@/features/stateManager/stateSlice"

export type FieldType = {
  exeUrl: string
  resolutionWidth: number
  resolutionHeight: number
  disableCharacterSelectTime: boolean
  disableInterfaceSelectTime: boolean
  disablePlayingModelTime: boolean
}

const Home: NextPage = () => {
  const [buttonDesc, setButtonDesc] = useState<string>(
    "Waiting to be clicked. This calls 'on_button_clicked' from Rust.",
  )
  const [messageApi, contextHolder] = message.useMessage()
  const [pageRender, setPageRender] = useState<boolean>(false)
  const [exeBuffer, setExeBuffer] = useState<Buffer>(Buffer.alloc(0))
  const [outExeUrl, setOutExeUrl] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<string>("Click to select")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const count = useAppSelector((state) => state.counter.value)
  const { defaultAlgorithm, darkAlgorithm } = theme
  const dispatch = useAppDispatch()

  useEffect(() => {
    setPageRender(true)
  }, [])

  const onButtonClick = () => {
    invoke<string>("on_button_clicked")
      .then((value) => {
        setButtonDesc(value)
      })
      .catch(() => {
        setButtonDesc("Failed to invoke Rust command 'on_button_clicked'")
      })
  }

  const shortcutHandler = useCallback(() => {
    console.log("Ctrl+P was pressed!")
  }, [])
  useGlobalShortcut("CommandOrControl+P", shortcutHandler)
  // useGlobalShortcut("CommandOrControl+R", ()=>{console.log("Ctrl+R was pressed!")})
  const handleFileChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === "done") {
      // Get this url from response in real world.
      const reader = new FileReader()
      reader.readAsArrayBuffer(info.file.originFileObj as RcFile)
      reader.onload = () => {
        const buffer = Buffer.from(reader.result as ArrayBuffer)
        // console.log(buffer)
        if (buffer.byteLength != fileCheckTotalSize) {
          messageApi.warning("Not supported file")
        } else {
          setExeBuffer(buffer)
        }
      }
      reader.onerror = (error) => {
        console.log(error)
      }
    }
  }

  const fileProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    onChange(info) {
      if (info.file.status === "done") {
        handleFileChange(info)
        setSelectedFile(info.file.name)
      }
    },
    onDrop(e) {
      console.log(e)
    },
  }

  const handleExeSelect = async () => {
    const selected = await open({
      multiple: false,
    })
    if (Array.isArray(selected)) {
      // user selected multiple files
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      // user selected a single file
      setOutExeUrl(selected)
      formik.setFieldValue("exeUrl", selected)
    }
  }

  const [form] = Form.useForm()
  const formik = useFormik({
    initialValues: {
      exeUrl: outExeUrl,
      resolutionWidth: 2560,
      resolutionHeight: 1440,
      disableCharacterSelectTime: true,
      disableInterfaceSelectTime: true,
      disablePlayingModelTime: false,
    },
    onSubmit: (values, actions) => {
      // console.log(values)
      if (exeBuffer.byteLength > 1) {
        setIsLoading(true)
        Xboost(exeBuffer, values)
          .then(() => {
            messageApi.success("Done")
            setIsLoading(false)
          })
          .catch((err) => {
            messageApi.warning("Error")
            console.log(err)
          })
      } else {
        messageApi.warning("No select exe")
      }
      actions.setSubmitting(false)
      actions.resetForm()
    },
  })

  return (
    <Fragment>
      {pageRender && (
        <ConfigProvider
          theme={{
            algorithm: defaultAlgorithm,
            }}
        >
          <StyleProvider hashPriority="high">
            <Layout>
              <Spin spinning={isLoading}>
                <div className="flex min-h-screen flex-col">
                  <Head>
                    <title>Create Next App</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                  </Head>

                  <main className="flex flex-1 flex-col items-center justify-center py-8">
                    <Form
                      form={form}
                      name="basic"
                      style={{ maxWidth: 500, padding: "20px" }}
                      onFinish={formik.handleSubmit}
                      initialValues={formik.initialValues}
                    >
                      <Dragger {...fileProps}>
                        <p className="ant-upload-text">Select exe path</p>
                        <p className="ant-upload-hint">{selectedFile}</p>
                      </Dragger>
                      <div style={{ paddingBottom: "1em" }}></div>
                      <Form.Item label="Out put exe path" name="exeUrl" required>
                        <Space.Compact style={{ width: "100%" }}>
                          <Input
                            defaultValue=""
                            name="exeUrl"
                            suffix={<></>}
                            value={outExeUrl}
                          />
                          <Button
                            type="primary"
                            onClick={() => {
                              handleExeSelect()
                            }}
                          >
                            Select
                          </Button>
                        </Space.Compact>
                      </Form.Item>
                      <Space.Compact>
                        <Form.Item label="Width" name="resolutionWidth" required>
                          <Input
                            name="resolution.width"
                            addonAfter={<>x</>}
                            suffix={<></>}
                            value={formik.values.resolutionWidth}
                          />
                        </Form.Item>
                        <Form.Item label="Height" name="resolutionHeight" required>
                          <Input name="resolutionHeight" suffix={<></>} />
                        </Form.Item>
                      </Space.Compact>

                      <Form.Item
                        name="disableCharacterSelectTime"
                        label="Disable Character Select Time"
                        valuePropName="checked"
                      >
                        <Switch
                          onChange={(e) => {
                            formik.setFieldValue("disableCharacterSelectTime", e)
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        name="disableInterfaceSelectTime"
                        label="Disable Interface SelectTime"
                        valuePropName="checked"
                      >
                        <Switch
                          onChange={(e) => {
                            formik.setFieldValue("disableInterfaceSelectTime", e)
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        name="disablePlayingModelTime"
                        label="Disable Play Mode ModeTime"
                        valuePropName="checked"
                      >
                        <Switch
                          onChange={(e) => {
                            formik.setFieldValue("disablePlayingModelTime", e)
                          }}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Patch
                        </Button>
                      </Form.Item>
                    </Form>
                  </main>
                  <footer className="flex flex-1 flex-grow-0 items-center justify-center border-t border-gray-200 py-4">
                    <div>
                      <a
                        href="https://tauri.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-grow items-center justify-center p-4"
                      >
                        Powered by{" "}
                        <span className="ml-2 h-6">
                          <Image
                            src="/tauri_logo_light.svg"
                            alt="Vercel Logo"
                            height={24}
                            width={78}
                          />
                        </span>
                      </a>
                    </div>
                  </footer>
                </div>
                {contextHolder}
              </Spin>
            </Layout>
          </StyleProvider>
        </ConfigProvider>
      )}
    </Fragment>
  )
}

export default Home
