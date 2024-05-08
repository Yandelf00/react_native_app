import { Text, View, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { images } from '../../constants'
import { Image } from 'react-native'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'

const SignUp= () => { 
  const [form, setForm] = useState({
    username:'',
    email:'',
    password:''
  })

  const[isSubmitting, setIsSubmitting] = useState(false)
  function submit(){

  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{height:'101%'}}>
        <View className='w-full justify-center min-h-full px-4 my-6'>
          <Image source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />
          <Text className='text-2xl text-white text-semibold
          mt-10 font-semibold'>Sign Up to Aora</Text>

          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e)=>setForm({...form, username: e})}
            otherStyles="mt-10"
          />

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e)=>setForm({...form, email : e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e)=>setForm({...form, password: e})}
            otherStyles="mt-7"
          />

          <CustomButton
            title='Sign In'
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-regular'>Have an account already ? </Text>
            <Link className='text-lg font-psemibold text-secondary-100' href='/sign-in'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp

